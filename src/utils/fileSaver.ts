import fs from "fs";

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

const fileSaver = async (file: any, name: string) => {
  try {
    const data = fs.readFileSync(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: data,
      Key: name
    };

    const url = await s3.upload(uploadParams).promise();

    // fs.writeFileSync(`./public/${name}`, data);
    // await fs.unlinkSync(file.path);
    return;
  } catch (error) {
    console.log("There was an error saving the file.");
  }
};
export default fileSaver;
