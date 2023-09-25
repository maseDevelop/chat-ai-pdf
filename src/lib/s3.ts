import AWS from "aws-sdk";
import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(file: File) {
  try {
    const s3 = new S3({
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    s3.putObject(
      params,
      (err: any, data: PutObjectCommandOutput | undefined) => {
        return Promise.resolve({
          file_key,
          file_name: file.name,
        });
      }
    );
  } catch (error) {
    Promise.reject(error);
  }
}

export function getS3URL(file_key: string) {
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${file_key}`;
}
