"use client";

import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AppSelect from "@/components/molecules/AppSelect";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FileUploadZone from "@/components/modules/distribution/FileUploadZone";

type distributionType = "equal" | "weighted";
const coinTypes = [
  { label: "STRK", value: "strk" },
  { label: "USDC", value: "usdc" },
  { label: "USDT", value: "usdt" },
];

const DistributePage = () => {
  const [distributionType, setDistributionType] =
    useState<distributionType>("equal");

  const [addresses, setAddresses] = useState<
    { address: string; amount: string }[]
  >([
    { address: "Address", amount: "Amount" },
    { address: "Address", amount: "Amount" },
    { address: "Address", amount: "Amount" },
  ]);
  const [, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const processFile = (file: File) => {
    setFileName(file.name);

    // Parse CSV file
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const rows = text.split("\n");
        const newAddresses = rows
          .filter((row) => row.trim() !== "")
          .map((row) => {
            const [address, amount] = row.split(",").map((item) => item.trim());
            return {
              address: address || "Address",
              amount: amount || "Amount",
            };
          });

        if (newAddresses.length > 0) {
          setAddresses(newAddresses);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files?.length) processFile(files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;

    if (files && files.length > 0) processFile(files[0]);
  };

  const handleAddRow = () => {
    setAddresses([...addresses, { address: "Address", amount: "Amount" }]);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle clicks outside the dropzone
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
  }, []);

  const toggleDistributionType = (checked: boolean) => {
    setDistributionType(checked ? "weighted" : "equal");
  };

  return (
    <DashboardLayout
      title="Create Distribution"
      className="flex flex-col gap-y-6"
    >
      <div className="flex w-full md:w-1/3 gap-x-6">
        <AppSelect title="Token" options={coinTypes} />

        <div>
          <h3 className="font-semibold mb-3">Distribution Type</h3>
          <div className="bg-fundable-mid-grey text-white py-3 rounded px-6 flex justify-center items-center gap-x-3">
            <Label
              htmlFor="equal"
              className={`cursor-pointer text-sm ${
                distributionType === "equal" ? "text-white" : "text-gray-400"
              }`}
            >
              Equal
            </Label>
            <Switch
              id={distributionType}
              checked={distributionType === "weighted"}
              onCheckedChange={toggleDistributionType}
            />
            <Label
              htmlFor="weighted"
              className={`cursor-pointer text-sm ${
                distributionType === "weighted" ? "text-white" : "text-gray-400"
              }`}
            >
              Weighted
            </Label>
          </div>
        </div>
      </div>

      <FileUploadZone />
    </DashboardLayout>
  );
};

export default DistributePage;
