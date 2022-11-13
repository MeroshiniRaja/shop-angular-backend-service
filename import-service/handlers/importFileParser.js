const S3 = require('aws-sdk/clients/s3');
const BUCKET = 'aws-import-service-bucket';
const s3 = new S3();
const csvParser = require('csv-parser');
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
    region: "us-east-1",
});
const QueueURL = `https://sqs.us-east-1.amazonaws.com/342406933836/catalogItemsQueue`;

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
  