// import fs from "fs";

const S3 = require("aws-sdk/clients/s3");
const bucketName = process.env.S3_BUCKET;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_UPLOAD_KEY;
const secretAccessKey = process.env.S3_UPLOAD_SECRET;
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

const deleteFile = async (name: string) => {
  try {
    const deleteParams = {
      Bucket: bucketName,
      Key: name
    };

    const url = await s3.deleteObject(deleteParams).promise();

    return;
  } catch (error) {
    console.log("There was an error deleting the file.");
  }
};
export default deleteFile;
