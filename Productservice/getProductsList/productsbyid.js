'use strict';

const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

module.exports.productsbyid = async (event) => {
  const { productId } = event.pathParameters;

  const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

  let startDate = new Date();

  const input = {
    TableName: "ProductsTable",
    Key: {
      id: { S: productId },
    }
  }

  try {
    const data = await dynamoClient.send(new GetItemCommand(input));
    var formattedObjects = {
      "id": data.Item.id.S,
      "count": data.Item.count.N,
      "description": data.Item.description.S,
      "price": data.Item.price.N,
      "title": data.Item.title.S
    };


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
