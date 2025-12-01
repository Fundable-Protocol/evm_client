"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";

const PaymentStreamPage = () => {
  const handleStarknetRedirect = () => {
    window.open("https://starknet.fundable.finance/payment-stream", "_blank");
  };

  return (
    <DashboardLayout
      title="Create Payment Streams"
      className="flex flex-col gap-y-6 h-full"
    >
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] px-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          {/* Icon/Visual Element */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30">
              <svg
                className="w-10 h-10 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl font-syne font-medium text-white mb-4">
            Payment Streams Coming Soon
          </h2>

          {/* Description */}
          <div className="space-y-4 text-gray-300 font-bricolage">
            <p className="text-base md:text-lg leading-relaxed">
              Payment streams are currently <span className="text-yellow-400 font-semibold">work in progress</span> on EVM chains.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              However, this feature is <span className="text-green-400 font-semibold">currently available on Starknet</span> and ready to use!
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-6">
            <Button
              onClick={handleStarknetRedirect}
              variant="gradient"
              size="lg"
              className="group"
            >
              <span>Use Payment Streams on Starknet</span>
              <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-gray-400 mt-6 pt-6 border-t border-gray-700/50">
            We&apos;re working hard to bring payment streams to EVM chains. Stay tuned for updates!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentStreamPage;
