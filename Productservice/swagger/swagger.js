// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "ProductService",
    "version": "1"
  },
  "paths": {
    "/products": {
      "get": {
        "summary": "getproductslist",
        "description": "",
        "operationId": "getproductslist.get./products",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      },
      "post": {
        "summary": "createProduct",
        "description": "",
        "operationId": "createProduct.post./products",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    },
    "/products/{productId}": {
      "get": {
        "summary": "productsbyid",
        "description": "",
        "operationId": "productsbyid.get./products/{productId}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "productId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "200 response"
          }
        }
      }
    }
  },
  "definitions": {},
  "securityDefinitions": {}
};