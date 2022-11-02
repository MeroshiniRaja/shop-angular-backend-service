'use strict';


const S3 = require('aws-sdk/clients/s3');
const BUCKET = 'aws-import-service-bucket';
const s3 = new S3();
const csvParser = require('csv-parser');

module.exports.importProductsFile = async (event) => {
  let {name} = event.queryStringParameters;
  console.log(`parsed/${name}`);
  let objectKey = `parsed/${name}`;
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
    console.log("Streaming File");
    const s3Stream = s3.getObject(params).createReadStream();

    s3Stream.pipe(csvParser()).on('data',(row)=>{
      console.log("Parsed Data", row);
    }).on('end',()=>{
      console.log("Reached End!")
    })

    // Copy object and delete object
    console.log("Copying file");
    await s3.copyObject({
      Bucket: BUCKET,
      CopySource: BUCKET + '/' + record.s3.object.key,
      Key: record.s3.object.key.replace('uploaded','parsed')
    }).promise();

    console.log("Deleting file");
    await s3.deleteObject({
      Bucket:BUCKET,
      Key: record.s3.object.key
    }).promise();

    console.log('Parsed file'+ record.s3.object.key.split('/')[1] +'is created')
  }

};
