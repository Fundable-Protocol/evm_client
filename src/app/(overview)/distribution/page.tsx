import DashboardLayout from "@/components/layouts/DashboardLayout";
import AppSelect from "@/components/molecules/AppSelect";
import React from "react";

const DistributePage = () => {
  return (
    <DashboardLayout title="Create Distribution">
      <div className="">
        <AppSelect />
      </div>
    </DashboardLayout>
  );
};

export default DistributePage;
