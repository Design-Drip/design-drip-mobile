import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.string().min(1, "Email is required").email(),
    username: z.string().min(1, "Username is required"),
    password: z
      .string()
      .min(6, "Must be at least 6 characters in length")
      .regex(new RegExp(".*\\d.*"), "One number")
      .regex(
        new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
        "One special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    rememberme: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
