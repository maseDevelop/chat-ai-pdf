import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export const getPineconeClient = () => {
  return new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  //Obtain the PDF and read the text
  console.log("Downloading S3 into file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("No File Found - could not download from s3");
  }
  const loader = new PDFLoader(file_name);
  // Get all pages in PDF
  const pages = await loader.load();
  return pages;
}
