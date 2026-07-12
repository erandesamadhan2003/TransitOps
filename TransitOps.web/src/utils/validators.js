/**
 * validators.js — Reusable Zod schema fragments
 * Import these in feature schemas.js files to avoid duplication.
 */
import { z } from 'zod'

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{9,14}$/, 'Enter a valid phone number')

export const emailSchema = z
  .string()
  .email('Enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')

export const requiredString = z
  .string()
  .min(1, 'This field is required')

export const positiveNumber = z
  .number({ invalid_type_error: 'Must be a number' })
  .positive('Must be a positive number')

export const futureDateSchema = z
  .string()
  .refine((val) => new Date(val) > new Date(), {
    message: 'Date must be in the future',
  })
