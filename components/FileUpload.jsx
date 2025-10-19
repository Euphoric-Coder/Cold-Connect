"use client";

import React, { useState, useRef } from "react";
import { Upload, File, CheckCircle, X } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const FileUpload = ({
  onFileSelect,
  accept = ".pdf",
  maxSize = 5,
  label = "Upload your resume",
  createdBy,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Convex Mutations
  const generateUploadUrl = useMutation(api.uploadResume.generateUploadUrl);
  const addFile = useMutation(api.uploadResume.addFile);
  const getFileURL = useMutation(api.storeFile.getFileURL);
  const deleteFile = useMutation(api.resumeDelete.deleteById);

  const validateFile = (file) => {
    if (!file.type.match("application/pdf")) {
      setError("Please upload a PDF file");
      return false;
    }
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size should be less than ${maxSize}MB`);
      return false;
    }
    setError(null);
    return true;
  };

  const uploadToConvex = async (selectedFile) => {
    try {
      setUploading(true);

      // Step 1: Generate upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload file directly to Convex Storage
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await res.json();

      // Step 3: Get permanent public URL via Convex mutation
      const fileURL = await getFileURL({ storageId });

      // Step 4: Store metadata in resumeFiles table
      await addFile({
        fileId: crypto.randomUUID(),
        storageId,
        fileName: selectedFile.name,
        fileURL,
        createdBy: createdBy || "anonymous",
      });

      setUploading(false);
      return { storageId, fileURL };
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Error uploading file. Try again.");
      setUploading(false);
      return null;
    }
  };

  const handleFile = async (selectedFile) => {
    if (validateFile(selectedFile)) {
      const result = await uploadToConvex(selectedFile);
      if (result) {
        const fullFileData = { ...selectedFile, ...result };
        setFile(fullFileData);
        onFileSelect(fullFileData);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleButtonClick = () => fileInputRef.current?.click();

  // Delete file from Convex storage on click
  const removeFile = async () => {
    try {
      if (file?.storageId) {
        await deleteFile({ storageId: file.storageId });
        console.log("File deleted from Convex");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
    } finally {
      setFile(null);
      setError(null);
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {!file ? (
        <motion.div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary-400 bg-primary-50 dark:bg-primary-900/10"
              : "border-dark-300 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-500"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <Upload className="mx-auto h-12 w-12 text-dark-400 mb-4" />
          <p className="font-medium mb-2">
            {uploading ? "Uploading..." : label}
          </p>
          <p className="text-sm text-dark-500">
            Drag & drop your PDF file here, or click to browse
          </p>
          <p className="text-xs text-dark-400 mt-2">
            Maximum file size: {maxSize}MB
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="border rounded-xl p-4 bg-dark-50 dark:bg-dark-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg mr-4">
              <File className="h-6 w-6 text-primary-500" />
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-xs text-dark-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={removeFile}
              className="p-2 text-dark-500 hover:text-error-500"
              aria-label="Remove file"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-2 flex items-center">
            <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
            <span className="text-sm text-success-600">File uploaded</span>
          </div>
        </motion.div>
      )}

      {error && (
        <p className="mt-2 text-sm text-error-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
