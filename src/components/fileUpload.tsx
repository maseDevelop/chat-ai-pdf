"use client";
import { Inbox } from "lucide-react";
import react, { useMemo } from "react";
import { useDropzone } from "react-dropzone";

export function FileUpload() {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      onDrop: (acceptedFiles) => console.log(acceptedFiles),
    });

  const baseClass =
    "border-dashed border-2 rounded-xl cursor-pointer bg-gray-100 py-8 flex justify-center items-center flex-col m-h-16 transition ease-in-out duration-500";

  // Define classes for different background colors
  const dragAcceptClass = "bg-gray-400";
  const dragRejectClass = "bg-red-200";

  // Generate the dynamic class based on the state
  const dropzoneClass = useMemo(() => {
    return `
      ${baseClass}
      ${isDragAccept ? dragAcceptClass : ""}
      ${isDragReject ? dragRejectClass : ""}
    `;
  }, [
    baseClass,
    dragAcceptClass,
    dragRejectClass,
    isFocused,
    isDragAccept,
    isDragReject,
  ]);

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className: dropzoneClass,
        })}
      >
        <input {...getInputProps()} />
        <>
          <Inbox className="w-10 h-10 " />
          {isDragReject ? (
            <p className="text-primary font-bold font-mono">
              Please upload a valid <span className="text-bold">PDF</span> file
            </p>
          ) : (
            <p className="text-primary font-bold font-mono">
              Drop your PDF here
            </p>
          )}
        </>
      </div>
    </div>
  );
}
