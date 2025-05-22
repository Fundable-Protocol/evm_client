"use client";

import UploadIcon from "@/components/svgs/UploadIcon";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface FileUploadZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onBrowseClick: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  setIsDragging: (dragging: boolean) => void;
  uploadErrors: string[];
  fileName?: string | null;
}

function FileUploadZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowseClick,
  onFileUpload,
  fileInputRef,
  setIsDragging,
  uploadErrors,
  fileName,
}: FileUploadZoneProps) {
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropZoneRef.current &&
        !dropZoneRef.current.contains(event.target as Node)
      ) {
        setIsDragging(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsDragging]);

  return (
    <div className="space-y-2">
      <div
        ref={dropZoneRef}
        className={cn(
          "border-2 border-dashed rounded-md p-8 transition-colors duration-200",
          isDragging ? "border-[#7F3DFF] bg-[#1A1A1A]/50" : "border-[#DEE2E6]",
          uploadErrors?.length > 0 ? "border-red-400" : ""
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div onClick={onBrowseClick} className="cursor-pointer">
            <UploadIcon />
          </div>
          <h3 className="text-xl font-semibold mb-1 text-white">
            Drag and drop a CSV file here, or click to select a file
          </h3>
          <p className="text-sm text-[#FFFFFF99] font-normal mb-4">
            CSV format: address, amount (one per line)
          </p>
          {fileName && (
            <p className="text-sm text-green-400 mb-2">Uploaded: {fileName}</p>
          )}
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={onFileUpload}
          />
        </div>
      </div>
      {/* <ErrorDisplay errors={uploadErrors} /> */}
    </div>
  );
}

export default FileUploadZone;
