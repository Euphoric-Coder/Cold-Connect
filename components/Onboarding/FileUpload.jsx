import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

const FileUpload = ({
  onFileSelect,
  accept = '.pdf',
  maxSize = 5, // Default 5MB
  label = 'Upload your resume',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file) => {
    // Check file type
    if (!file.type.match('application/pdf')) {
      setError('Please upload a PDF file');
      return false;
    }
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size should be less than ${maxSize}MB`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        onFileSelect(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        id="file-upload"
      />
      
      {!file ? (
        <motion.div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10' 
              : 'border-dark-300 dark:border-dark-700 hover:border-primary-400 dark:hover:border-primary-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Upload className="mx-auto h-12 w-12 text-dark-400 dark:text-dark-500 mb-4" />
          <p className="font-medium mb-2">{label}</p>
          <p className="text-sm text-dark-500 dark:text-dark-400">
            Drag and drop your PDF file here, or click to browse
          </p>
          <p className="text-xs text-dark-400 dark:text-dark-500 mt-2">
            Maximum file size: {maxSize}MB
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="border rounded-xl p-4 bg-dark-50 dark:bg-dark-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-lg mr-4">
              <File className="h-6 w-6 text-primary-500" />
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-xs text-dark-500 dark:text-dark-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button 
              onClick={removeFile}
              className="p-2 text-dark-500 hover:text-error-500 transition-colors"
              aria-label="Remove file"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-2 flex items-center">
            <CheckCircle className="h-4 w-4 text-success-500 mr-2" />
            <span className="text-sm text-success-600 dark:text-success-400">File uploaded successfully</span>
          </div>
        </motion.div>
      )}
      
      {error && (
        <motion.p 
          className="mt-2 text-sm text-error-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FileUpload;