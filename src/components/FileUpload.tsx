"use client";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Inbox, Loader2 } from "lucide-react";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const [uploadComplete, setUploadComplete] = React.useState(false);

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

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);
        setUploadComplete(false);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!");
            setUploadComplete(true);
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error("Error creating chat");
            console.error(err);
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-lg max-w-xs mx-auto">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-lg cursor-pointer bg-gray-50 py-4 px-4 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {(uploading || isLoading) && !uploadComplete ? (
          <>
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            <p className="mt-2 text-xs text-slate-400">Uploading to Database</p>
            <p className="text-xs text-slate-400">Generating Vectors</p>
          </>
        ) : (
          <>
            <Inbox className="w-6 h-6 text-blue-500" />
            <p className="mt-2 text-xs text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
