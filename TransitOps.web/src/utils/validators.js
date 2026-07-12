import { z } from "zod";

export const requiredString = (label = "This field") =>
  z.string().min(1, `${label} is required`);

export const email = z.string().email("Enter a valid email address");

export const password = z
  .string()
  .min(8, "Password must be at least 8 characters");

export const phone = z
  .string()
  .min(10, "Enter a valid phone number")
  .max(15, "Enter a valid phone number");

export const positiveNumber = (label = "Value") =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .positive(`${label} must be greater than 0`);

export const nonNegativeNumber = (label = "Value") =>
  z.coerce
    .number({ invalid_type_error: `${label} must be a number` })
    .min(0, `${label} cannot be negative`);

export const registrationNumber = z
  .string()
  .min(4, "Enter a valid registration number")
  .max(15, "Registration number is too long")
  .regex(/^[A-Z0-9\-]+$/i, "Only letters, numbers and hyphens are allowed");

export const futureDate = z
  .string()
  .min(1, "Date is required")
  .refine((val) => new Date(val) > new Date(), {
    message: "Date must be in the future",
  });

export const pastOrPresentDate = z
  .string()
  .min(1, "Date is required")
  .refine((val) => new Date(val) <= new Date(), {
    message: "Date cannot be in the future",
  });
