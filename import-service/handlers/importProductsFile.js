const S3 = require('aws-sdk/clients/s3');
const BUCKET = 'aws-import-service-bucket';
const s3 = new S3();

module.exports.importProductsFile = async (event) => {
    
    let objectKey = `uploaded/Products.csv`;
    try{
      let params = {
        Bucket: BUCKET,
        Key: objectKey,
        ContentType: "text/csv",
        Expires: 100
      }
      const signedUrl = s3.getSignedUrl("putObject", params);
      return {
        statusCode:200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'x-amz-acl': 'public-read' 
        },
        body:JSON.stringify(signedUrl)
      }
    }
    catch(error){
      console.log(error);
      return{
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: 'Please check the logs'
      }
    }
  };