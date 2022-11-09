'use strict';


const S3 = require('aws-sdk/clients/s3');
const BUCKET = 'aws-import-service-bucket';
const s3 = new S3();
const csvParser = require('csv-parser');
const QueueURL = `https://sqs.us-east-1.amazonaws.com/342406933836/catalogItemsQueue`;
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
    region: "us-east-1",
});
const {v4: uuid} = require('uuid');
const sns = new AWS.SNS({
  region: "us-east-1",
});

const documentClient = new AWS.DynamoDB.DocumentClient();


module.exports.importProductsFile = async (event) => {
  let {name} = event.queryStringParameters;
  console.log(`uploaded/${name}`);
  let objectKey = `uploaded/${name}`;
  try{
    let params = {
      Bucket: BUCKET,
      Key: objectKey,
      Expires: 100
    }
    const signedUrl = s3.getSignedUrl('getObject',params);
    return {
      statusCode:200,
      body:JSON.stringify(signedUrl)
    }
  }
  catch(error){
    console.log(error);
    return{
      statusCode: 500,
      body: 'Please check the logs'
    }
  }
};

module.exports.importFileParser = async (event) => {
  try {
    const results = await parseFile(event.Records[0].s3.object.key)
    console.log(results);
    for (const result of results) {
        await sqs.sendMessage({
            QueueUrl: QueueURL,
            MessageBody: JSON.stringify(result),
        }).promise();
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({message: `All files been processed.`}),
    };
  } catch (e) {
      return {
          statusCode: 500,
          headers: {
              'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({message: `ERROR: ${e}`}),
      };
  }
};

function parseFile(fileName) {
  const s3Params = {
      Bucket: BUCKET,
      Key: fileName,
  }

  return new Promise((resolve) => {
      let results = [];
      s3.getObject(s3Params).createReadStream().pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => {
              return resolve(results)
          });
  });
}

module.exports.catalogBatchProcess = async (event) => {
  try {
    for (const record of event.Records) {
        console.log('Message Body -->  ', record.body);
        const item = await JSON.parse(record.body)

        const id = uuid();
        
        await documentClient.put({
          TableName: "ProductsListTable",
          Item: {
              id,
              title: item.title,
              description: item.description,
              price: item.price
          },
        }).promise();
        await documentClient.put({
          TableName: "StockListTable",
          Item: {
              product_id: id,
              count: item.count ?? 1,
          },
        }).promise();
    }

    const snsParams = {
      TopicArn: 'arn:aws:sns:us-east-1:342406933836:createProductTopic',
      Subject: 'Products processed.',
      Message: `Products processed: ${JSON.stringify(event.Records)}`,
    };

    await sns.publish(snsParams).promise();

    return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({message: `All files been processed.`}),
    };
  }
  catch (e) {
    return {
        statusCode: 500,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({message: `ERROR: ${e}`}),
    };
  }
}