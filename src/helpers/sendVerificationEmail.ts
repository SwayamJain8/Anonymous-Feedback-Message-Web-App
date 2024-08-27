// Importing the resend instance created in mysterymessage/src/lib/resend.ts
import { resend } from "@/lib/resend";

// Imoprting the template for the verification email from mysterymessage/src/emails/VerificationEmail.tsx
import VerificationEmail from "../../emails/VerificationEmail";

// Importing the ApiResponse interface from mysterymessage/src/types/ApiResponse.ts to know the shape of the response from the API
import { ApiResponse } from "@/types/ApiResponse";

// Creating and exporting the sendVerificationEmail function that takes in the email, username, and verifyCode as arguments and returns a Promise of ApiResponse
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Sending the verification email using the resend instance created
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    // Returning the success message if the email is sent successfully
    return {
      success: true,
      message: "Verification email send successfully",
    };
  } catch (err) {
    console.log("Error sending verification email", err);
    // Returning the error message if the email is not sent successfully
    return {
      success: false,
      message: "Error sending verification email",
    };
  }
}
