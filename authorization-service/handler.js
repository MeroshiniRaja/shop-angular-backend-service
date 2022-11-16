'use strict';

module.exports.basicAuthorizer = async (event) => {
  console.log(event);
  const token = event.authorizationToken;
  const methodArn = event.methodArn;
  const principalId = 'testLog';
  const effect = isValidToken(token)? 'Allow':'Deny';
  
 // const policyDocument = getPolicyDocument(methodArn, effect);

  const authResponse = {"principalId":principalId, "policyDocument":{
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn
        //Resource: "arn:aws:execute-api:us-east-1:342406933836:3nbbmjyey1/*/*",
      }
    ]
  }}

  return authResponse;
};

function isValidToken(token){
  let isValid = false;
  
  if(token){
     const [, value] = token.split(' ');
     const decoded = Buffer.from(value, 'base64').toString('utf8');
     const [user, pass] = decoded.split(':');
    
    isValid = "TEST_PASSWORD" === pass;
    isValid = true;
  }
  
  return isValid;
}