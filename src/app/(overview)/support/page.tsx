"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SupportCard from "@/components/modules/support/SupportCard";
import { ContactSupportModal } from "@/components/modules/support/ContactSupportModal";
import { SupportSuccessModal } from "@/components/modules/support/SupportSuccessModal";
import MailIcon from "@/components/svgs/MailIcon";
import FarcasterIcon from "@/components/svgs/FarcasterIcon";
import { SendIcon } from "lucide-react";

const HelpPage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const handleContactSuccess = (generatedTicketNumber: string) => {
    setTicketNumber(generatedTicketNumber);
    setIsSuccessModalOpen(true);
  };

  const supportCards = [
    {
      id: "email",
      icon: <MailIcon className="w-6 h-6" />,
      title: "Email Support",
      description:
        "Send us a detailed message and we'll get back to you within 24 hours.",
      buttonText: "Send Email",
      contactInfo: "support@fundable.finance",
      action: () => {
        setIsContactModalOpen(true);
      },
    },

    {
      id: "telegram",
      icon: <SendIcon className="w-6 h-6" />,
      title: "Telegram Support",
      description:
        "Chat us on our telegram and we will get back to you as soon as possible",
      buttonText: "Send a Message",
      contactInfo: "FundableHq",
      action: () => {
        window.open(" https://t.me/fundable_finance", "_blank");
      },
    },
    // {
    //   id: "discord",
    //   icon: <DiscordIcon className="w-6 h-6" />,
    //   title: "Discord Support",
    //   description:
    //     "Chat us on discord and we will get back to you as soon as possible",
    //   buttonText: "Join Discord",
    //   contactInfo: "Fundable Discord",
    //   action: () => {
    //     window.open("https://discord.gg/fundable", "_blank");
    //   },
    // },
    {
      id: "farcaster",
      icon: <FarcasterIcon className="w-6 h-6" />,
      title: "Farcaster",
      description:
        "Chat us on our farcaster and we will get back to you as soon as possible",
      buttonText: "Send a Message",
      contactInfo: "Fundable Farcaster",
      action: () => {
        window.open("https://farcaster.xyz/fundable", "_blank");
      },
    },
    // {
    //   id: "whatsapp",
    //   icon: <WarningIcon className="w-6 h-6" />,
    //   title: "Emergency???",
    //   description:
    //     "For critical issues affecting your  dashboard, please call our emergency hotline VIA WHATSAPP @ +234-001-234-6789",
    //   buttonText: "Send a Message",
    //   contactInfo: "+234-001-234-6789",
    //   action: () => {
    //     const message = encodeURIComponent(
    //       "Hello Fundable Support Team, I need emergency assistance with my dashboard."
    //     );
    //     window.open(`https://wa.me/2340012346789?text=${message}`, "_blank");
    //   },
    // },
  ];

  return (
    <DashboardLayout title="" className="h-screen overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="mb-6 flex-shrink-0">
          <p className="text-[#E1E1E1] text-sm sm:text-xl max-w-4xl mx-auto text-center">
            Need help with your dashboard? Our support team is here to assist
            you. Choose the method that works best for you.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2  xl:grid-cols-3 gap-14 sm:px-9.5 sm:py-7.5 min-h-full">
            {supportCards.map((card) => (
              <SupportCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
                contactInfo={card.contactInfo}
                handleOnClick={card.action}
              />
            ))}
          </div>
        </div>

        <ContactSupportModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          onSuccess={handleContactSuccess}
        />

        <SupportSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          ticketNumber={ticketNumber}
        />
      </div>
    </DashboardLayout>
  );
};

export default HelpPage;
