import Navbar from "@/components/organisms/Navbar";
import Hero from "@/components/modules/landing-page/Hero";
import FaqSection from "@/components/modules/landing-page/FaqSection";
import FeatureSection from "@/components/modules/landing-page/FeatureSection";
import UtilitySection from "@/components/modules/landing-page/UtilitySection";
import BlogSection from "@/components/modules/landing-page/BlogSection";
import Footer from "@/components/organisms/Footer";

export default function Home() {
  return (
    <main className="h-dvh flex flex-col overflow-auto text-white">
      <Navbar />
      <div className="flex-1 overflow-auto space-y-8">
        <Hero />
        <FeatureSection />
        <UtilitySection />
        <FaqSection />
        <BlogSection />
        <Footer />
      </div>
    </main>
  );
}
