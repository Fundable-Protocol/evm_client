"use client";

import UploadIcon from "@/components/svgs/UploadIcon";
import { cn } from "@/lib/utils";
import { parse as papaParse } from "papaparse";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { validateCsvData } from "@/validations";
import { DistributionDataProps } from "@/types/distribution";

function DistributionFileUpload({
  distributionData,
  distributionType,
  setDistributionData,
}: DistributionDataProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      papaParse(file, {
        complete: (result) => {
          const { data: csvData, errors } = result;

          if (errors.length) {
            toast.error(
              "Error uploading CSV. Make sure it's properly formatted with only address, amount, and label (if enabled)."
            );
            return;
          }

          const { success, data, message } = validateCsvData(csvData);

          if (!success) {
            toast.error(message!);
            return;
          }

          const nonEmptyRows = distributionData?.filter(
            (data) => data.address
          );

          if (nonEmptyRows?.length) {
            setDistributionData((prevData) => [...prevData, ...nonEmptyRows]);
          } else {
            setDistributionData(data!);
          }

          return;
        },
        header: false,
        skipEmptyLines: true,
      });
    },
    [distributionData, setDistributionData]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "text/csv": [".csv"] },
  });

  const isEqualDistribution = distributionType?.type === "equal";

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-md transition-colors duration-200 p-6 md:p-12 grid place-content-center mt-4"
      )}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <UploadIcon />

        <h3 className="text-lg md:text-xl font-semibold mb-1 text-white">
          Drag and drop a CSV file here, or click to select a file
        </h3>
        <p className="text-xs md:text-sm text-gray-400 font-normal mb-4">
          CSV format:{" "}
          {isEqualDistribution ? "address, label" : "address, amount, label"}
          (one per line)
        </p>
        <input {...getInputProps()} />
      </div>
    </div>
  );
}

export default DistributionFileUpload;
