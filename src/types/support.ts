import React from "react";



export interface SupportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  contactInfo?: string;
  handleOnClick?: () => void;
}

export interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (ticketNumber: string) => void;
}

export interface SupportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber?: string;
}
export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

