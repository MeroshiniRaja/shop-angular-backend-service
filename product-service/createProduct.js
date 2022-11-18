'use strict';

const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const ULID = require("ulid");

module.exports.createProduct = async (event) => {
    const {title,description,price} = JSON.parse(event.body);

    console.log("GET", "createProduct", event.body);

    const id = ULID.ulid();

    const dynamoClient = new DynamoDBClient({ region: "us-east-1" });

    const input = {
        TableName:"ProductsListTable",
        Item: {
            id: { S: id},
            title: { S: title},
            description: { S: description},
            price: { N: price}
        }
    }

    try{
        await dynamoClient.send(new PutItemCommand(input));
    } catch(err){
        console.log(`Something went wrong: ${err}`, 500);
    }

    //To return the added product
    const newProduct = {
        id: { S: id},
        title: { S: title},
        description: { S: description},
        price: { N: price}
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
          },
        body: JSON.stringify(newProduct)
    }
}