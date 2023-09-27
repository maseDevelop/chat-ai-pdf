import {
  GetObjectAclCommandInput,
  GetObjectAclCommandOutput,
  GetObjectCommandOutput,
  S3,
} from "@aws-sdk/client-s3";
import { rejects } from "assert";
import fs from "fs";
import { Readable } from "stream";

export async function downloadFromS3(file_key: string) {
  try {
    const s3 = new S3({
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    const file_name = `tmp/pdf-${Date.now()}.pdf`;

    // Wrap the AWS SDK operation in a Promise
    const data = await new Promise((resolve, reject) => {
      s3.getObject(params, (err: any, data: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    //@ts-ignore
    if (data && data.Body instanceof Readable) {
      const fileWrite = fs.createWriteStream(file_name);

      await new Promise((resolve, reject) => {
        //@ts-ignore
        data.Body?.pipe(fileWrite)
          .on("finish", () => {
            console.log("File download complete.");
            resolve(file_name);
          })
          .on("error", (err: any) => {
            console.error("Error downloading file:", err);
            reject(err);
          });
      });

      return file_name; // Return the file name when download is complete
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
