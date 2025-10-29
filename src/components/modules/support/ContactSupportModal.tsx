"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

import {
  ContactSupportModalProps,
  ContactFormData,
} from "@/types/support";
import {
  validateField,
  createEmptyFormState,
} from "@/lib/utils/support";

export function ContactSupportModal({
  isOpen,
  onClose,
  onSuccess,
}: ContactSupportModalProps) {
  const [formData, setFormData] = useState<ContactFormData>(
    createEmptyFormState()
  );
  const [errors, setErrors] = useState<ContactFormData>(
    createEmptyFormState()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    Object.values(formData).every((value) => value.trim() !== "") &&
    Object.values(errors).every((error) => error === "");

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }

    try {
      setIsSubmitting(true);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const generatedTicketNumber = `SUP-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 1000000)
      ).padStart(6, "0")}`;
      setFormData(createEmptyFormState());
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
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent
        showCloseButton={false}
        className=" sm:max-w-4xl  overflow-y-hidden  rounded-lg md:rounded-xl shadow-lg  p-4 md:p-6 lg:p-8 "
      >
        <DialogTitle className="sr-only"> Customer Support</DialogTitle>
        <div className="flex justify-between items-start mb-4 md:mb-6">
          <div className="flex-1 pr-4">
            <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-black font-syne mb-1 md:mb-2 leading-tight">
              Customer Support
            </h2>
            <p className="text-xs md:text-sm lg:text-base text-black font-normal font-inter py-2">
              Send us a message and we&apos;ll get back to you within 24 hours.
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
        <div className="space-y-4 md:space-y-6">
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
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              disabled={isSubmitting}
              required
              autoComplete="name"
              className={`w-full h-12 bg-transparent placeholder:text-fundable-placeholder focus-visible:ring-0 font-normal font-urbanist text-sm md:text-base focus:ring-0 focus:outline-none rounded-md border px-3 ${
                errors.fullName
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-300"
              }`}
            />
            {errors.fullName && (
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
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email address"
              disabled={isSubmitting}
              required
              autoComplete="email"
              className={`w-full h-12 bg-transparent placeholder:text-fundable-placeholder focus-visible:ring-0 font-normal font-urbanist text-sm md:text-base focus:ring-0 focus:outline-none rounded-md border px-3 ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-300"
              }`}
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
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="Brief description of your issues"
              disabled={isSubmitting}
              required
              className={`w-full h-12 bg-transparent placeholder:text-fundable-placeholder focus-visible:ring-0 font-normal font-urbanist text-sm md:text-base focus:ring-0 focus:outline-none rounded-md border px-3 ${
                errors.subject
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-300"
              }`}
            />
            {errors.subject && (
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
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Please provide detailed information about your issue, including any error messages or steps you've taken..."
              disabled={isSubmitting}
              required
              className={`w-full min-h-[100px] md:min-h-[120px] bg-transparent focus-visible:ring-0 placeholder:text-fundable-placeholder font-normal font-urbanist lg:min-h-[140px] px-3 py-2 md:py-3 text-sm md:text-base border rounded-md focus:ring-0 focus:outline-none resize-none ${
                errors.message
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-300"
              }`}
              rows={4}
            />
            {errors.message && (
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
              type="button"
              onClick={handleSubmit}
              className="w-full sm:w-auto h-12 text-sm md:text-base bg-fundable-deep-purple-light text-white hover:bg-fundable-green/90 order-1 sm:order-2 rounded-[4px] px-6"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
