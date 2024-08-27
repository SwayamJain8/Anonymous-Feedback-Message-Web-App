// Import zod for schema validation
import { z } from "zod";

// Define verifySchema schema
export const verifySchema = z.object({
  code: z.string().length(6, "Verification code must be 6 characters long"),
});
