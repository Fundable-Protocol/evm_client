"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface SupportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber?: string;
}

export function SupportSuccessModal({
  isOpen,
  onClose,
  ticketNumber = "SUP-2025-031377",
}: SupportSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyTicket = async () => {
    try {
      await navigator.clipboard.writeText(ticketNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy ticket number:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className=" w-full sm:max-w-4xl   bg-white rounded-lg md:rounded-xl lg:rounded-2xl  mx-4 md:mx-0 p-4 md:p-6 lg:p-8"
      >
        <DialogTitle className="sr-only">
          {" "}
          Message sent successfully!!!{" "}
        </DialogTitle>

        <DialogHeader>
          <div className="flex items-center gap-x-4 mb-3 sm:mb-6 ">
            <div className="w-11 h-11 bg-fundable-purple-2 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-8 h-8 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white font-bold" />
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-fundable-mid-dark leading-tight sm:ml-4">
              Message sent successfully!!!
            </h2>
          </div>
        </DialogHeader>

        <div className="">
          <p className="text-sm sm:text-base text-fundable-mid-dark">
            Your support request has been received and a ticket has been
            created.
          </p>
          <div className="flex items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 sm:text-xl">
              <span className=" font-bold text-fundable-mid-dark">
                Ticket Number:
              </span>
              <span className="font-bold text-fundable-mid-dark break-all sm:break-normal">
                {ticketNumber}
              </span>
            </div>
            <Button
              onClick={handleCopyTicket}
              variant="ghost"
              size="sm"
              className=" w-auto h-8 md:h-10 text-xs md:text-sm text-fundable-purple-2 hover:text-fundable-deep-purple hover:bg-blue-50 self-start sm:self-auto"
            >
              <Copy className="w-3 h-3 md:w-4 md:h-4 mr-0.5" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="mt-2 border-b-2 border-dashed  relative" />
        </div>

        <div>
          <h3 className="text-base  font-medium text-fundable-mid-grey mb-1">
            What happens next?
          </h3>
          <ul className="space-y-1 ">
            <li className="flex items-start">
              <span className="text-gray-600 mr-2 md:mr-3 mt-1 text-sm md:text-base">
                •
              </span>
              <span className="text-sm md:text-base  text-fundable-mid-dark leading-relaxed ">
                Our support team will review your request
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2 md:mr-3 mt-1 text-sm md:text-base">
                •
              </span>
              <span className="text-sm md:text-base  text-fundable-mid-dark leading-relaxed">
                You'll receive an email confirmation shortly
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2 md:mr-3 mt-1 text-sm md:text-base">
                •
              </span>
              <span className="text-sm md:text-base  text-fundable-mid-dark leading-relaxed">
                Expected response time: 24 hours
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-600 mr-2 md:mr-3 mt-1 text-sm md:text-base">
                •
              </span>
              <span className="text-sm md:text-base  text-fundable-mid-dark leading-relaxed">
                Updates will be sent to your email address
              </span>
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
