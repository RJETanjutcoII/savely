import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  username: z
    .string()
    .trim()
    .min(4, "Username must be 4–30 chars")
    .max(30, "Username must be 4–30 chars")
    .regex(/^[A-Za-z0-9_]+$/, "Letters, numbers, underscore only"),
  password: z
    .string()
    .min(8, "8+ characters")
    .regex(/[a-z]/, "Needs a lowercase letter")
    .regex(/[A-Z]/, "Needs an uppercase letter")
    .regex(/\d/, "Needs a number")
    .regex(/[^A-Za-z0-9]/, "Needs a special character"),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
