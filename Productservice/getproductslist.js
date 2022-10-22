'use strict';

const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

module.exports.getproductslist = async (event) => {
  const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

  const ProductTable = {
    TableName: "ProductsListTable"
  }
  const StockTable = {
    TableName: "StockListTable"
  }

  try {
    const data = await dynamoClient.send(new ScanCommand(ProductTable));
    const stockData = await dynamoClient.send(new ScanCommand(StockTable));
    console.log(stockData.Items);

    var formattedObjects = data.Items.map(function (item) {
      const stock = stockData.Items.find(st=>st.product_id.S === item.id.S);
      if(stock){
        return {
          "id": item.id.S,
          "description": item.description.S,
          "price": item.price.N,
          "title": item.title.S,
          "count": stock.count.N
        };
      } else {
        return {
          "id": item.id.S,
          "description": item.description.S,
          "price": item.price.N,
          "title": item.title.S
        }
      } 
    });

    console.log(formattedObjects);
    
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
