import {
  Pinecone,
  Vector,
  utils as PineconeUtils,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";

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
  // Obtain the PDF and read the text
  console.log("Downloading S3 into file system");
  console.log("file key", fileKey);

  const file_name = await downloadFromS3(fileKey);

  if (!file_name) {
    throw new Error("No File Found - could not download from s3");
  }

  const loader = new PDFLoader(file_name);
  // Get all pages in PDF
  const pages = (await loader.load()) as PDFPage[];

  // Split and segment the PDF into smaller documents
  const documents = await Promise.all(pages.map(prepareDocument));

  // Vectorise and embed documents
  const vectors = await Promise.all(documents.flat().map(embedDocuments));

  // Upload vectors to pincone
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("chat-ai-pdf");

  console.log("Inserting vectors into pinecone");

  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
  namespace.upsert(vectors);

  return documents[0];
}

export async function embedDocuments(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embeddings,
      metadata: { text: doc.metadata.text, pageNumber: doc.metadata.pageNumbe },
    } as PineconeRecord<RecordMetadata>;
  } catch (error) {
    console.log("error embedding documents", error);
    throw error;
  }
}

export function truncateStringByBytes(string: string, bytes: number) {
  const encoder = new TextEncoder();
  return new TextDecoder("utf-8").decode(
    encoder.encode(string).slice(0, bytes)
  );
}

export async function prepareDocument(page: PDFPage) {
  const { pageContent, metadata } = page;
  // Split the documents
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent: pageContent.replace(/\n/g, ""),
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
