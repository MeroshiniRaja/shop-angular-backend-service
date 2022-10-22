'use strict';

const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

module.exports.getproductslist = async (event) => {
  const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

  let startDate = new Date();

  const input = {
    TableName: "ProductsListTable",
  }

  try {
    const data = await dynamoClient.send(new ScanCommand(input));

    var formattedObjects = data.Items.map(function (item) {
      return {
        "id": item.id.S,
        "count": item.count.N,
        "description": item.description.S,
        "price": item.price.N,
        "title": item.title.S
      };
    });
    data
    let endDate = new Date();
    let executionTimeInSeconds = (endDate.getTime() - startDate.getTime()) / 1000;
    console.log("Execution time:", executionTimeInSeconds);
    if (!formattedObjects) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'NotResultFound',
        }),
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify(formattedObjects)
    };
  } catch (err) {
    console.log(err);
  }
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
