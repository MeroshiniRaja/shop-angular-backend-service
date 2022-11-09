const AWS = require("aws-sdk");
const {v4: uuid} = require('uuid');
const sns = new AWS.SNS({
  region: "us-east-1",
});
const documentClient = new AWS.DynamoDB.DocumentClient();

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