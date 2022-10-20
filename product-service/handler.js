'use strict';
const fs = require("fs");

module.exports.getProductsList = async (event) => {
  try {
    const jsonString = fs.readFileSync("./product.json");
  const productsList = JSON.parse(jsonString);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify(productsList)
    }; 
  }catch (err) {
    return {
      statusCode: 404,
      body: 'No Item Found',
    };
  }  
};

module.exports.getProductsById = async (event) => {
 try {
    let productId = event.pathParameters.productId;
    console.log(productId);
    let product = await getProductsById(productId);
    console.log(product);
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (err) {
    return {
      statusCode: 404,
      body: 'No Item Found',
    };
  }
};

function getProductsById(id) {
  const jsonString = fs.readFileSync("./product.json");
  const customer = JSON.parse(jsonString);
  let result = ''
  customer.map(c => {
    if (c.id === id) {
      result = c;
    }
  });
  return result;
}

