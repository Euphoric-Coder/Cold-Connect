"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  File,
  CheckCircle,
  X,
  Edit3,
  Save,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const fileInputRef = useRef(null);

  // Convex Mutations
  const generateUploadUrl = useMutation(api.uploadResume.generateUploadUrl);
  const addFile = useMutation(api.uploadResume.addFile);
  const getFileURL = useMutation(api.storeFile.getFileURL);
  const deleteFile = useMutation(api.resumeDelete.deleteById);
  const updateFileName = useMutation(api.uploadResume.updateFileName);

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

      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await res.json();

      const fileURL = await getFileURL({ storageId });

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
        setEditedName(selectedFile.name);
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
      onFileSelect(null);
    }
  };

  const saveNewName = async () => {
    if (!file?.storageId || !editedName.trim()) return;
    try {
      setSavingName(true);
      await updateFileName({
        storageId: file.storageId,
        newName: editedName.trim(),
      });
      setFile((prev) => ({ ...prev, name: editedName.trim() }));
      setIsEditing(false);
      toast.success("File name updated successfully.");
    } catch (err) {
      console.error("Error updating file name:", err);
      setError("Failed to update file name.");
    } finally {
      setSavingName(false);
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
          {/* Uploaded File Information */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 p-3 rounded-lg">
                <File className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-dark-700 dark:text-dark-100 font-semibold">
                  Resume Uploaded Successfully
                </p>
                <p className="text-xs text-dark-500">
                  You can edit the name or view the uploaded file below.
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-dark-500 hover:text-error-500 transition-colors"
              aria-label="Remove file"
            >
              <X size={20} />
            </button>
          </div>

          {/* File Name Editor Section */}
          <div className="p-3 rounded-lg bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700">
            <label className="block text-sm font-semibold text-dark-700 dark:text-dark-200 mb-1">
              File Name
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-grow bg-dark-50 dark:bg-dark-800 border border-dark-300 dark:border-dark-600 rounded-md px-3 py-2 text-dark-800 dark:text-dark-100 focus:ring-2 focus:ring-primary-400 outline-none"
              />
              <button
                onClick={saveNewName}
                disabled={savingName}
                className="flex items-center gap-1 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors"
              >
                {savingName ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Name
                  </>
                )}
              </button>
            </div>
          </div>

          {/* File Link Section */}
          {file.fileURL && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <a
                href={file.fileURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 inline-flex items-center gap-2 font-medium"
              >
                <ExternalLink size={16} /> View Uploaded File
              </a>
              <p className="text-xs text-dark-500">
                File size: {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          {/* Success indicator */}
          <div className="mt-4 flex items-center">
            <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
            <span className="text-sm text-success-600">
              Resume stored securely on ColdConnect
            </span>
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
