"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import react, { useMemo, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";

export function FileUpload() {
  const [isUploadingToS3, setIsUploadingToS3] = useState<boolean>(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      onDrop: async (acceptedFiles) => {
        console.log(acceptedFiles);
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0]; //only allow one file at a time
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File to large");
          return;
        }
        try {
          setIsUploadingToS3(true);
          const data = await uploadToS3(file);
          console.log("data", data);
          if (!data?.file_key || !data.file_name) {
            toast.error("Opps something went wrong!");
            return;
          }

          mutate(data, {
            onSuccess(data) {},
            onError(error, variables, context) {
              toast.error("Error creating chat");
              console.error(error);
            },
          });
        } catch (error) {
          toast.error("Opps something went wrong!");
          console.error(error);
        } finally {
          setIsUploadingToS3(false);
        }
      },
      onDropRejected: (fileRejections) => {
        const errorCodes = fileRejections[0].errors.map((e) => e.code);
        if (errorCodes.includes(ErrorCode.FileInvalidType)) {
          toast.error("Invalid file type!");
        } else {
          toast.error("Opps something went wrong!");
        }
      },
    });

  const baseClass =
    "border-dashed border-2 rounded-xl cursor-pointer bg-gray-100 py-8 flex justify-center items-center flex-col m-h-16 transition ease-in-out duration-500";

  // Define classes for different background colors
  const dragAcceptClass = "bg-gray-300";
  const dragRejectClass = "bg-red-200";
  const isUploadingClass = "bg-gray-300";

  // Generate the dynamic class based on the state
  const dropzoneClass = useMemo(() => {
    return `
      ${baseClass}
      ${isUploadingToS3 ? isUploadingClass : ""}
      ${isUploadingToS3 ? "" : isDragAccept ? dragAcceptClass : ""}
      ${isUploadingToS3 ? "" : isDragReject ? dragRejectClass : ""}
    `;
  }, [
    baseClass,
    dragAcceptClass,
    dragRejectClass,
    isFocused,
    isDragAccept,
    isDragReject,
    isUploadingToS3,
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
          {isUploadingToS3 || isLoading ? (
            <>
              <Loader2 className="w-10 h-10" />
              <p className="text-primary font-bold font-mono">
                Creating chat...
              </p>
            </>
          ) : (
            <>
              <Inbox className="w-10 h-10 " />
              {isDragReject ? (
                <p className="text-primary font-bold font-mono">
                  Please upload a valid <span className="text-bold">PDF</span>{" "}
                  file
                </p>
              ) : (
                <p className="text-primary font-bold font-mono">
                  Drop your PDF here
                </p>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
}
