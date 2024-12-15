import React, { useState } from "react";
import { supabase } from "../supabase";

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const bucketName = "social-sphare";
    const fileName = `${Date.now()}-${file.name}`;

    try {
      setUploadStatus("Uploading...");
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file:", error);
        setUploadStatus("Upload failed!");
        return;
      }

      const publicUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/${bucketName}/${data.path}`;
      setFileUrl(publicUrl);
      setUploadStatus("Upload successful!");
    } catch (err) {
      console.error("Unexpected error:", err);
      setUploadStatus("Upload failed!");
    }
  };

  return (
    <div>
      <h1>Upload File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>
      <p>{uploadStatus}</p>
      {fileUrl && (
        <div>
          <p>File URL:</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
