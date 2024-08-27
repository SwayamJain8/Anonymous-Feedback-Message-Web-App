// Import zod for schema validation
import { z } from "zod";

// Define messageSchema schema
export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Content must be at least 10 character long")
    .max(300, "Content must be at most 300 characters long"),
});
