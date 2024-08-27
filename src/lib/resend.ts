//Importing Resend for sending emails
import { Resend } from "resend";

// Creating and exporting a new instance of Resend with the API key
export const resend = new Resend(process.env.RESEND_API_KEY);
