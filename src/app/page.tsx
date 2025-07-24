'use client';

import { useEffect } from 'react';
import { useMiniKit, useAddFrame } from '@coinbase/onchainkit/minikit';
import Navbar from "@/components/organisms/Navbar";
import Hero from "@/components/modules/landing-page/Hero";
import FaqSection from "@/components/modules/landing-page/FaqSection";
import FeatureSection from "@/components/modules/landing-page/FeatureSection";
import UtilitySection from "@/components/modules/landing-page/UtilitySection";
// import BlogSection from "@/components/modules/landing-page/BlogSection";
import Footer from "@/components/organisms/Footer";

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const addFrame = useAddFrame();

  // The setFrameReady() function is called when your mini-app is ready to be shown
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Prompt user to add frame when app loads
  useEffect(() => {
    if (isFrameReady) {
      addFrame();
    }
  }, [isFrameReady, addFrame]);
  return (
    <main className="h-dvh flex flex-col overflow-auto text-white">
      <Navbar />
      <div className="flex-1 overflow-auto space-y-8">
        <Hero />
        <FeatureSection />
        <UtilitySection />
        <FaqSection />
        {/* <BlogSection /> */}
        <Footer />
      </div>
    </main>
  );
}
