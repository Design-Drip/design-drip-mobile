import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  rememberme: z.boolean().optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
