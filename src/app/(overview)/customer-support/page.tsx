"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SupportCard from "@/components/modules/support/SupportCard";
import { ContactSupportModal } from "@/components/modules/support/ContactSupportModal";
import MailIcon from "@/components/svgs/MailIcon";
import TelegramIcon from "@/components/svgs/TelegramIcon";
import DiscordIcon from "@/components/svgs/DiscordIcon";
import FarcasterIcon from "@/components/svgs/FarcasterIcon";
import WarningIcon from "@/components/svgs/WarningIcon";



const HelpPage = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <DashboardLayout title="" className="">
      <div className="mb-11">
        <p className="text-[#E1E1E1] text-sm sm:text-2xl max-w-4xl mx-auto text-center">
          Need help with your dashboard? Our support team is here to assist you.
          Choose the method that works best for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 px-9.5 py-7.5">
        <SupportCard
          icon={<MailIcon className="w-6 h-6" />}
          title="Email Support"
          description="Send us a detailed message and we'll get back to you within 24 hours."
          buttonText="Send Email"
          contactInfo="support@fundable.finance"
          handleOnClick={() => setIsContactModalOpen(true)}
        />

        {/* Telegram Support Card */}
        <SupportCard
          icon={<TelegramIcon className="w-6 h-6" />}
          title="Telegram Support"
          description="Chat us on our telegram and we will get back to you as soon as possible"
          buttonText="Send a Message"
          contactInfo="FundableHq"

        />

        {/* Discord Support Card */}
        <SupportCard
          icon={<DiscordIcon className="w-6 h-6" />}
          title="Discord Support"
          description="Chat us on discord and we will get back to you as soon as possible"
          buttonText="Join Discord"
          contactInfo="Fundable Discord"
        />

        {/* Farcaster Support Card */}
        <SupportCard
          icon={<FarcasterIcon className="w-6 h-6" />}
          title="Farcaster"
          description="Chat us on our farcaster and we will get back to you as soon as possible"
          buttonText="Send a Message"
          contactInfo="Fundable Farcaster"
        />

        <SupportCard
          icon={<WarningIcon className="w-6 h-6" />}
          title="Emergency???"
          description="For critical issues affecting your  dashboard, please call our emergency hotline VIA WHATSAPP @ +234-001-234-6789"
          buttonText="Send a Message"
          contactInfo="+1 (555) 123-4567"
        />
      </div>

      <ContactSupportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default HelpPage;
