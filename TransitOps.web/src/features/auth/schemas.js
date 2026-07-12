import { z } from "zod";
import { email, password } from "@/utils/validators";

export const loginSchema = z.object({
  email,

  password: z.string().min(1, "Password is required"),
});
