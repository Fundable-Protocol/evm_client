"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (ticketNumber: string) => void;
}

export function ContactSupportModal({
  isOpen,
  onClose,
  onSuccess,
}: ContactSupportModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    subject: false,
    message: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2)
          return "Full name must be at least 2 characters";
        return "";
      case "email":
        return validateEmail(value);
      case "subject":
        if (!value.trim()) return "Subject is required";
        if (value.trim().length < 5)
          return "Subject must be at least 5 characters";
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10)
          return "Message must be at least 10 characters";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Real-time validation for email
    if (field === "email") {
      const error = validateEmail(value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    } else {
      // Clear error when user starts typing for other fields
      if (errors[field as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    }
  };

  const handleInputBlur = (field: string, value: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Only validate on blur for non-email fields (email is validated in real-time)
    if (field !== "email") {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      subject: true,
      message: true,
    });

    // Validate all fields
    const newErrors = {
      fullName: validateField("fullName", formData.fullName),
      email: validateField("email", formData.email),
      subject: validateField("subject", formData.subject),
      message: validateField("message", formData.message),
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (hasErrors) {
      return;
    }

    try {
      setIsSubmitting(true);

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

            // Generate a ticket number (in real app, this would come from the API)
      const generatedTicketNumber = `SUP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
      
      // Close contact modal and trigger success callback
      onClose();
      onSuccess?.(generatedTicketNumber);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Only allow closing via the close button or ESC key, not outside clicks
        if (open === false) {
          // This prevents outside clicks from closing the modal
          return;
        }
      }}
      modal={true}
    >
      <DialogContent
        showCloseButton={false}
        className=" sm:max-w-4xl  overflow-y-hidden  rounded-lg md:rounded-xl shadow-lg mx-4 md:mx-0 p-4 md:p-6 lg:p-8 "
        onPointerDownOutside={(e) => {
          // Prevent outside clicks from closing the modal
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          // Prevent outside interactions from closing the modal
          e.preventDefault();
        }}
      >
        <DialogTitle className="sr-only">  Customer Support</DialogTitle>
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <div className="flex-1 pr-4">
            <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-black font-syne mb-1 md:mb-2 leading-tight">
              Customer Support
            </h2>
            <p className="text-xs md:text-sm lg:text-base text-black font-normal font-inter py-2">
              Send us a message and we'll get back to you within 24 hours.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="fullName"
              className="text-sm md:text-base font-medium text-black"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              onBlur={(e) => handleInputBlur("fullName", e.target.value)}
              placeholder="Enter your full name"
              className={`bg-transparent w-full h-12 placeholder:text-fundable-placeholder focus-visible:ring-0 font-normal font-urbanist text-sm md:text-base focus:ring-0 focus:outline-none rounded-md ${
                touched.fullName && errors.fullName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-300"
              }`}
              disabled={isSubmitting}
              required
              autoComplete="name"
            />
            {touched.fullName && errors.fullName && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="email"
              className="text-sm md:text-base font-medium text-black"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onBlur={(e) => handleInputBlur("email", e.target.value)}
              placeholder="Enter your email address"
              className={`w-full h-12 bg-transparent placeholder:text-fundable-placeholder font-normal font-urbanist text-sm md:text-base focus-visible:ring-0 focus:ring-0 focus:outline-none rounded-md ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-300"
              }`}
              disabled={isSubmitting}
              required
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="subject"
              className="text-sm md:text-base font-medium text-black"
            >
              Subject
            </Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              onBlur={(e) => handleInputBlur("subject", e.target.value)}
              placeholder="Brief description of your issues"
              className={`w-full h-12 text-sm bg-transparent placeholder:text-fundable-placeholder focus-visible:ring-0 font-normal font-urbanist md:text-base focus:ring-0 focus:outline-none rounded-md ${
                touched.subject && errors.subject
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-300"
              }`}
              disabled={isSubmitting}
              required
            />
            {touched.subject && errors.subject && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.subject}
              </p>
            )}
          </div>

          <div className="space-y-1 md:space-y-2">
            <Label
              htmlFor="message"
              className="text-sm md:text-base font-medium text-black"
            >
              Message
            </Label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              onBlur={(e) => handleInputBlur("message", e.target.value)}
              placeholder="Please provide detailed information about your issue, including any error messages or steps you've taken..."
              className={`w-full min-h-[100px] md:min-h-[120px] bg-transparent focus-visible:ring-0 placeholder:text-fundable-placeholder font-normal font-urbanist lg:min-h-[140px] px-3 py-2 md:py-3 text-sm md:text-base border rounded-md focus:ring-0 focus:outline-none resize-none ${
                touched.message && errors.message
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-300"
              }`}
              disabled={isSubmitting}
              required
              rows={4}
            />
            {touched.message && errors.message && (
              <p className="text-red-500 text-xs md:text-sm mt-1">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 md:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto h-12 text-sm md:text-base border-gray-300 text-black hover:bg-gray-50 order-2 sm:order-1 rounded-[4px] px-6"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto h-12 text-sm md:text-base bg-gray-800 hover:bg-gray-900 text-white order-1 sm:order-2 rounded-[4px] px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Save Message"}
            </Button>
          </div>
                </form>
      </DialogContent>
    </Dialog>
  );
}
