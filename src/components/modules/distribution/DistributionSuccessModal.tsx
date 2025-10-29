"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Share2, 
  Eye, 
  ArrowRight,
  Twitter,
  Linkedin,
  MessageCircle
} from "lucide-react";
import { DistributionAttributes } from "@/types/distribution";
import SocialShareModal from "./SocialShareModal";
import { getExplorerUrl } from "@/lib/utils/history";

interface DistributionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewHistory: () => void;
  distribution: DistributionAttributes;
}

const DistributionSuccessModal: React.FC<DistributionSuccessModalProps> = ({
  isOpen,
  onClose,
  onViewHistory,
  distribution,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);

  if (!isOpen) return null;

  const handleQuickShare = async (platform: string) => {
    const transactionUrl = getExplorerUrl(distribution) || "#";

    let shareUrl = "";
    let shareText = "";

    switch (platform) {
      case "twitter":
        shareText = `🚀 Just distributed ${distribution.total_amount} ${distribution.token_symbol} to ${distribution.total_recipients} addresses using @FundableHQ! Check it out: ${transactionUrl}`;
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        break;
      case "linkedin":
        shareText = `Successfully completed a token distribution of ${distribution.total_amount} ${distribution.token_symbol} to ${distribution.total_recipients} recipients using Fundable Finance.`;
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(transactionUrl)}&summary=${encodeURIComponent(shareText)}`;
        break;
      case "telegram":
        shareText = `✅ Distribution complete! ${distribution.total_amount} ${distribution.token_symbol} sent to ${distribution.total_recipients} addresses via @fundable_finance`;
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(transactionUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "farcaster":
        shareText = `Successfully completed a token distribution of ${distribution.total_amount} ${distribution.token_symbol} to ${distribution.total_recipients} recipients using @fundable_finance.`;
        shareUrl = `https://farcaster.xyz/fundable/post?text=${encodeURIComponent(shareText)}`;
        break;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };


  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-fundable-dark border border-fundable-purple/30 rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-[640px] mx-auto shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          {/* Success Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-green-400/20 to-emerald-500/20 p-4 sm:p-6 rounded-full border border-green-400/30">
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-400 drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
              Distribution Successful!
            </h3>
            <p className="text-fundable-white/80 text-base sm:text-lg">
              Your tokens have been successfully distributed
            </p>
          </div>

          {/* Distribution Summary */}
          <div className="bg-gradient-to-br from-fundable-mid-dark to-fundable-mid-dark/80 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8 border border-fundable-mid-grey/20">
            <h4 className="text-white font-semibold mb-4 text-lg">Distribution Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1">
                <p className="text-fundable-white/70 text-sm font-medium uppercase tracking-wide">Amount</p>
                <p className="text-white font-bold text-xl">
                  {distribution.total_amount} {distribution.token_symbol}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-fundable-white/70 text-sm font-medium uppercase tracking-wide">Recipients</p>
                <p className="text-white font-bold text-xl">
                  {distribution.total_recipients} addresses
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-fundable-white/70 text-sm font-medium uppercase tracking-wide">Type</p>
                <p className="text-white font-semibold capitalize">
                  {distribution.distribution_type}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-fundable-white/70 text-sm font-medium uppercase tracking-wide">Network</p>
                <p className="text-white font-semibold">
                  {distribution.chain_name}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Share Section */}
          <div className="mb-6 sm:mb-8">
            <h4 className="text-white font-semibold mb-4 text-lg flex items-center gap-3">
              <div className="bg-fundable-purple/20 p-2 rounded-lg">
                <Share2 className="h-5 w-5 text-fundable-purple" />
              </div>
              Share Your Success
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <Button
                onClick={() => handleQuickShare("twitter")}
                variant="outline"
                size="sm"
                className="bg-fundable-mid-dark border-fundable-mid-grey/30 hover:bg-fundable-mid-grey/40 hover:border-fundable-purple/50 text-white flex items-center gap-2 h-12 transition-all duration-200"
              >
                <Twitter className="h-5 w-5" />
                <span className="font-medium">Twitter</span>
              </Button>
              <Button
                onClick={() => handleQuickShare("linkedin")}
                variant="outline"
                size="sm"
                className="bg-fundable-mid-dark border-fundable-mid-grey/30 hover:bg-fundable-mid-grey/40 hover:border-fundable-purple/50 text-white flex items-center gap-2 h-12 transition-all duration-200"
              >
                <Linkedin className="h-5 w-5" />
                <span className="font-medium">LinkedIn</span>
              </Button>
              <Button
                onClick={() => handleQuickShare("telegram")}
                variant="outline"
                size="sm"
                className="bg-fundable-mid-dark border-fundable-mid-grey/30 hover:bg-fundable-mid-grey/40 hover:border-fundable-purple/50 text-white flex items-center gap-2 h-12 transition-all duration-200"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Telegram</span>
              </Button>
            </div>
            <div className="text-center">
              <Button
                onClick={() => setShowShareModal(true)}
                variant="ghost"
                size="sm"
                className="text-fundable-purple hover:text-fundable-purple/80 hover:bg-fundable-purple/10 font-medium"
              >
                Customize message
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onViewHistory}
              variant="outline"
              size="md"
              className="flex-1 bg-fundable-mid-dark border-fundable-mid-grey/30 hover:bg-fundable-mid-grey/40 hover:border-fundable-purple/50 text-white flex items-center justify-center gap-3 h-12 transition-all duration-200"
            >
              <Eye className="h-5 w-5" />
              <span className="font-medium">View Details</span>
            </Button>
            <Button
              onClick={onClose}
              variant="gradient"
              size="md"
              className="flex-1 flex items-center justify-center gap-3 h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span>Continue</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        distribution={distribution}
      />
    </>
  );
};

export default DistributionSuccessModal;
