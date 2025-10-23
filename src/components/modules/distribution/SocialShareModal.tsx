"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Copy, 
  Check,
  ExternalLink,
  Share2,
  X
} from "lucide-react";
import { DistributionAttributes } from "@/types/distribution";
import { toast } from "react-hot-toast";
import { getExplorerUrl } from "@/lib/utils/history";

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  distribution: DistributionAttributes;
}

interface ShareTemplate {
  platform: string;
  icon: React.ComponentType<{ className?: string }>;
  template: string;
  url: string;
}

const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  distribution,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Generate shareable content
  const transactionUrl = getExplorerUrl(distribution) || "#";

  const shareTemplates: ShareTemplate[] = [
    {
      platform: "Twitter",
      icon: Twitter,
      template: `🚀 Just distributed ${distribution.total_amount} ${distribution.token_symbol} to ${distribution.total_recipients} addresses using @FundableHQ! Check it out: ${transactionUrl}`,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `🚀 Just distributed ${distribution.total_amount} ${distribution.token_symbol} to ${distribution.total_recipients} addresses using @FundableHQ! Check it out: ${transactionUrl}`
      )}`,
    },
    {
      platform: "LinkedIn",
      icon: Linkedin,
      template: `Successfully completed a token distribution of ${distribution.total_amount} ${distribution.token_symbol} to ${distribution.total_recipients} recipients using Fundable Finance. Streamlining crypto distributions made easy!`,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(transactionUrl)}&summary=${encodeURIComponent(
        `Successfully completed a token distribution of ${distribution.total_amount} ${distribution.token_symbol} to ${distribution.total_recipients} recipients using Fundable Finance.`
      )}`,
    },
    {
      platform: "Telegram",
      icon: MessageCircle,
      template: `✅ Distribution complete! ${distribution.total_amount} ${distribution.token_symbol} sent to ${distribution.total_recipients} addresses via Fundable Finance`,
      url: `https://t.me/share/url?url=${encodeURIComponent(transactionUrl)}&text=${encodeURIComponent(
        `✅ Distribution complete! ${distribution.total_amount} ${distribution.token_symbol} sent to ${distribution.total_recipients} addresses via @fundable_finance`
      )}`,
    },
  ];

  const handleShare = (template: ShareTemplate) => {
    const message = template.template;
    const shareUrl = template.platform === "Twitter" 
      ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
      : template.platform === "LinkedIn"
      ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(transactionUrl)}&summary=${encodeURIComponent(message)}`
      : template.platform === "Telegram"
      ? `https://t.me/share/url?url=${encodeURIComponent(transactionUrl)}&text=${encodeURIComponent(message)}`
      : template.url;

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleCopyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(platform);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  const handleCopyTransactionLink = () => {
    if (distribution.transaction_hash) {
      navigator.clipboard.writeText(transactionUrl).then(() => {
        toast.success("Transaction link copied!");
      });
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <div className="bg-fundable-dark border border-fundable-purple/20 rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-fundable-purple/30 to-fundable-purple/10 p-3 rounded-xl border border-fundable-purple/20">
                  <Share2 className="h-6 w-6 text-fundable-purple" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Share Your Success
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-fundable-white/50 hover:text-white transition-colors p-2 hover:bg-fundable-mid-grey/20 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Distribution Summary Card */}
              <div className="bg-gradient-to-br from-fundable-mid-dark/50 to-fundable-mid-dark/30 p-6 rounded-xl border border-fundable-mid-grey/10 backdrop-blur-sm">
                <h3 className="text-white font-semibold mb-4 text-lg">Distribution Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-fundable-white/60 text-xs font-medium uppercase tracking-wider">Amount</p>
                    <p className="text-white font-bold text-lg">
                      {distribution.total_amount} {distribution.token_symbol}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-fundable-white/60 text-xs font-medium uppercase tracking-wider">Recipients</p>
                    <p className="text-white font-bold text-lg">
                      {distribution.total_recipients} addresses
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-fundable-white/60 text-xs font-medium uppercase tracking-wider">Type</p>
                    <p className="text-white font-semibold capitalize">
                      {distribution.distribution_type}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-fundable-white/60 text-xs font-medium uppercase tracking-wider">Network</p>
                    <p className="text-white font-semibold">
                      {distribution.network}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Sharing */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Share on Social Media</h3>
                <div className="space-y-3">
                  {shareTemplates.map((template) => {
                    const Icon = template.icon;
                    const message = template.template;
                    const isCopied = copiedText === template.platform;

                    return (
                      <div key={template.platform} className="group">
                        <div className="flex items-center gap-3 p-4 bg-fundable-mid-dark/30 hover:bg-fundable-mid-dark/50 rounded-xl border border-fundable-mid-grey/10 hover:border-fundable-purple/20 transition-all duration-200 cursor-pointer"
                             onClick={() => handleShare(template)}>
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fundable-purple/20 to-fundable-purple/10 flex items-center justify-center border border-fundable-purple/20">
                              <Icon className="h-5 w-5 text-fundable-purple" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm">Share on {template.platform}</p>
                            <p className="text-fundable-white/60 text-xs truncate">
                              {message.length > 50 ? `${message.substring(0, 50)}...` : message}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyToClipboard(message, template.platform);
                            }}
                            className="flex-shrink-0 p-2 rounded-lg hover:bg-fundable-mid-grey/40 transition-colors"
                          >
                            {isCopied ? (
                              <Check className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4 text-fundable-white/50 group-hover:text-fundable-white/70" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transaction Link */}
              {distribution.transaction_hash && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg">Transaction Details</h3>
                  <div className="group">
                    <div className="flex items-center gap-3 p-4 bg-fundable-mid-dark/30 hover:bg-fundable-mid-dark/50 rounded-xl border border-fundable-mid-grey/10 hover:border-fundable-purple/20 transition-all duration-200 cursor-pointer"
                         onClick={handleCopyTransactionLink}>
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <Copy className="h-5 w-5 text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">Copy Transaction Link</p>
                        <p className="text-fundable-white/60 text-xs truncate">
                          View transaction on {distribution.network} explorer
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(transactionUrl, "_blank");
                        }}
                        className="flex-shrink-0 p-2 rounded-lg hover:bg-fundable-mid-grey/40 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-fundable-white/50 group-hover:text-fundable-white/70" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={onClose} 
                  variant="gradient"
                  size="md"
                  className="px-8 h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialShareModal;
