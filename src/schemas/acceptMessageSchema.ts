// Import zod for schema validation
import { z } from "zod";

// Define acceptMessageSchema schema
export const acceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
});
