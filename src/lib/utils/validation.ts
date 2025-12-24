import { z } from "zod";

/**
 * Email validation schema
 */
export const emailSchema = z.string().email("Invalid email address");

/**
 * Password validation schema
 * Requires at least 8 characters, one uppercase, one lowercase, one number
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/**
 * Required string validation
 */
export const requiredString = (fieldName: string = "This field") =>
  z.string().min(1, `${fieldName} is required`);

/**
 * Optional string validation
 */
export const optionalString = z.string().optional();

/**
 * File size validation (in bytes)
 */
export const fileSizeSchema = (maxSize: number, maxSizeMB: number) =>
  z.number().max(maxSize, `File size must be less than ${maxSizeMB}MB`);

/**
 * URL validation schema
 */
export const urlSchema = z.string().url("Invalid URL");

/**
 * Phone number validation schema (basic)
 */
export const phoneSchema = z
  .string()
  .regex(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    "Invalid phone number"
  );

/**
 * Validate form data against a schema
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Validation result with success flag and errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; data?: T; errors?: Record<string, string> } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _general: "Validation failed" } };
  }
}
