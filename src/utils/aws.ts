// @ts-ignore
const fs = require("fs");
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

// downloads a file from s3
export function getImage(fileKey: string) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  };
  return s3.getObject(downloadParams).createReadStream();
}
