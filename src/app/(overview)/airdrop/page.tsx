import DashboardLayout from "@/components/layouts/DashboardLayout";

const AdminPage = () => {
  return (
    <DashboardLayout
      title="Create Campaign"
      className="flex flex-col gap-y-6 h-full"
      availableNetwork={[""]}
    ></DashboardLayout>
  );
};

export default AdminPage;
