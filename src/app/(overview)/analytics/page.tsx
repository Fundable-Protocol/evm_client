import DashboardLayout from "@/components/layouts/DashboardLayout";

const AnalyticsPage = () => {
  return (
    <DashboardLayout
      title="View Analytics"
      className="flex flex-col gap-y-6 h-full"
      availableNetwork={[""]}
    ></DashboardLayout>
  );
};

export default AnalyticsPage;
