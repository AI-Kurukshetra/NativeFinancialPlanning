import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid work email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, "Enter your full name."),
  organizationName: z.string().min(2, "Enter your organization name."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;

