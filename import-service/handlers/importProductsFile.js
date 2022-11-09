const S3 = require('aws-sdk/clients/s3');
const BUCKET = 'aws-import-service-bucket';
const s3 = new S3();

module.exports.importProductsFile = async (event) => {
    
    let objectKey = `uploaded/Products.csv`;
    try{
      let params = {
        Bucket: BUCKET,
        Key: objectKey,
        Expires: 100
      }
      const signedUrl = s3.getSignedUrl('getObject',params);
      return {
        statusCode:200,
        body:JSON.stringify(signedUrl)
      }
    }
    catch(error){
      console.log(error);
      return{
        statusCode: 500,
        body: 'Please check the logs'
      }
    }
  };