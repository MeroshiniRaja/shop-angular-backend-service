'use strict';

const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

module.exports.productsbyid = async (event) => {
  const { productId } = event.pathParameters;

  console.log("GET", "getProductsById", event.pathParameters);

  const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

  const ProductTable = {
    TableName: "ProductsListTable",
    Key: {
      id: { S: productId },
    }
  }
  const StockTable = {
    TableName: "StockListTable",
    Key: {
      product_id: { S: productId },
    }
  }

  try {
    const data = await dynamoClient.send(new GetItemCommand(ProductTable));
    const stockData = await dynamoClient.send(new GetItemCommand(StockTable));

    var formattedObjects = {
      "id": data.Item.id.S,
      "description": data.Item.description.S,
      "price": data.Item.price.N,
      "title": data.Item.title.S,
      "count": stockData.Item.count.N
    };

    if (!formattedObjects) {
      return {
        statusCode: 400,
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
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(formattedObjects)
    };
  } catch (err) {
    console.log(`Something went wrong: ${err}`, 500);
  }
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
