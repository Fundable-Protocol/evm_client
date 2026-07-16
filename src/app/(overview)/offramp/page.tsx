import DashboardLayout from "@/components/layouts/DashboardLayout";
import OfframpExperience from "@/components/modules/offramp/OfframpExperience";

export default function OfframpPage() {
  return (
    <DashboardLayout title="Offramp" className="px-1 pb-8 sm:px-3 lg:px-5">
      <OfframpExperience />
    </DashboardLayout>
  );
}
