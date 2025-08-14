import { z } from "zod";
import { ContactFormData } from "@/types/support";

// Modern Zod schema with refined validation
export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .min(5, "Subject must be at least 5 characters"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;

export const validateField = (
  field: keyof ContactFormData,
  value: string
): string => {
  const result = contactFormSchema.shape[field].safeParse(value);
  return result.success
    ? ""
    : result.error.issues[0]?.message || "Invalid input";
};

export const createEmptyFormState = () => ({
  fullName: "",
  email: "",
  subject: "",
  message: "",
});
