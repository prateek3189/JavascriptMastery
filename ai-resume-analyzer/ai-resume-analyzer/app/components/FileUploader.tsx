import React, { useState, useRef } from "react";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    onFileSelect?.(selectedFile);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      // Check file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (validTypes.includes(selectedFile.type)) {
        // Check file size (20MB)
        if (selectedFile.size <= 20 * 1024 * 1024) {
          handleFileSelect(selectedFile);
        } else {
          alert("File size must be less than 20MB");
        }
      } else {
        alert("Please select a PDF, DOC, or DOCX file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (validTypes.includes(selectedFile.type)) {
        if (selectedFile.size <= 20 * 1024 * 1024) {
          handleFileSelect(selectedFile);
        } else {
          alert("File size must be less than 20MB");
        }
      } else {
        alert("Please select a PDF, DOC, or DOCX file");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full gradient-border">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`flex flex-col gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />
        <div className="space-y-4 cursor-pointer"></div>
        {file ? (
          <div
            className="uploader-selected-file"
            onClick={(e) => e.stopPropagation()}
          >
            <img src="/images/pdf.png" alt="" className="size-10" />

            <div className="flex items-center space-x-3">
              <div>
                <p className="text-sm font-medium truncate text-gray-700 max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
              </div>
            </div>
            <button className="uploader-remove-file p-2 cursor-pointer">
              <img
                src="/icons/cross.svg"
                alt="remove"
                className="size-4"
                onClick={() => handleFileSelect(null)}
              />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
              <img src="/icons/info.svg" alt="upload" className="size-20" />
            </div>
            <p className="text-lg text-gray-500">
              <span className="font-semibold">Click to upload</span> or Drag &
              Drop
            </p>
            <p className="text-lg text-gray-500">PDF, DOC, DOCX (max 20 MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
