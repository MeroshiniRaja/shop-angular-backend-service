'use strict';

const S3 = require('aws-sdk/clients/s3');
const BUCKET = 'aws-import-service-bucket';
const s3 = new S3();

module.exports.importProductsFile = async (event) => {
  let {name} = event.queryStringParameters;
  console.log(`uploaded/${name}`);
  let objectKey = `uploaded/${name}`;
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

module.exports.importFileParser = async (event) => {

  for( const record of event.Records){

    //Create read stream
    const params = {
      Bucket: BUCKET,
      Key: record.s3.object.key
    }

    const s3Stream = s3.getObject(params).createReadStream();

    s3Stream.on('data',(row)=>{
      console.log(row.toString());
    }).on('end',()=>{
      console.log("Reached End!")
    })

    // Copy object and delete object
    await s3.copyObject({
      Bucket: BUCKET,
      CopySource: BUCKET + '/' + record.s3.object.key,
      Key: record.s3.object.key.replace('uploaded','parsed')
    }).promise();

    await s3.deleteObject({
      Bucket:BUCKET,
      Key: record.s3.object.key
    }).promise();

    console.log('Parsed file'+ record.s3.object.key.split('/')[1] +'is created')
  }

};
