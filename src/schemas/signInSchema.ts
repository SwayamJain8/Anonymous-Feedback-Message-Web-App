// Import zod for schema validation
import { z } from "zod";

// Define signInSchema schema
export const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});
