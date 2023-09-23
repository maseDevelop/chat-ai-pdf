"use client";
import { Inbox } from "lucide-react";
import react from "react";
import { useDropzone } from "react-dropzone";

export function FileUpload() {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => console.log(acceptedFiles),
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl curser-pointer bg-gray-100 py-8 flex justify-center items-center flex-col m-h-16",
        })}
      >
        <input {...getInputProps()} />
        <>
          <Inbox className="w-10 h-10 " />
          <p className="text-primary font-bold font-mono">Drop your PDF here</p>
        </>
      </div>
    </div>
  );
}
