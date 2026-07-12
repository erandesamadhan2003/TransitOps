import { z } from "zod";
import { requiredString, phone } from "@/utils/validators";
import { LICENSE_CATEGORIES } from "@/constants/app";

export const driverSchema = z.object({
  name: requiredString("Driver name"),
  licenseNumber: z.string().min(3, "Enter a valid license number"),
  licenseCategory: z.enum(LICENSE_CATEGORIES, {
    errorMap: () => ({ message: "Select a license category" }),
  }),
  licenseExpiry: z.string().min(1, "License expiry is required"),
  contactNumber: phone,
  safetyScore: z.coerce.number().min(0).max(100).optional(),
});
