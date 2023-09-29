"use client";
import { Loader2 } from "lucide-react";
import React from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { PDFDocumentProxy } from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

type Props = { pdf_url: string };

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

type PDFFile = string | File | null;

export function PDFViewer({ pdf_url }: Props) {
  const [numPages, setNumPages] = React.useState(0);
  const [file, setFile] = React.useState<PDFFile>("");

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  return (
    <Document
      file={pdf_url}
      options={options}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={
        <div className="flex flex-col items-center relative left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="w-10 h-10 animate-spin" />
          <h1 className="text-primary font-mono  text-xl font-semibold">
            Loading...
          </h1>
        </div>
      }
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      ))}
    </Document>
  );
}
