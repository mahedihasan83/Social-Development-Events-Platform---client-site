

import { z } from "zod";


export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}


export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.");

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long."),
  email: z.email("Please enter a valid email address."),
  photoUrl: z.url("Photo URL must be a valid URL (https://…)."),
  password: passwordSchema,
});

export const eventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long.")
    .max(120, "Title cannot exceed 120 characters."),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters long.")
    .max(2000, "Description cannot exceed 2000 characters."),
  eventType: z.string().min(1, "Please select an event type."),
  thumbnailUrl: z.string().trim().url("Thumbnail must be a valid image URL (https://…)."),
  location: z
    .string()
    .trim()
    .min(3, "Location must be at least 3 characters long.")
    .max(120, "Location cannot exceed 120 characters."),

  date: z
    .string()
    .min(1, "Event date is required.")
    .refine(
      (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= todayISO(),
      "Event date must be today or a future date."
    ),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;


export function issuesToFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string") {
      fieldErrors[key] ??= issue.message;
    }
  }
  return fieldErrors;
}
