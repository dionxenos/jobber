import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required").max(100),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    telephone: z.string().min(1, "Telephone is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    roleCode: z.enum(["CANDI", "EMPLO"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterForm = z.infer<typeof registerSchema>;

export const profileEditSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  telephone: z.string().min(1, "Telephone is required"),
});

export type ProfileEditForm = z.infer<typeof profileEditSchema>;
