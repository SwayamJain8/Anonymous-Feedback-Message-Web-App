// Importing dbConnect to connect to the database
import dbConnect from "@/lib/dbConnect";

// Importing UserModel to interact with the user in the database
import UserModel from "@/model/User";

// Importing z from zod to validate the query parameters
import { z } from "zod";

// Importing usernameValidation schema for validating the username
import { usernameValidation } from "@/schemas/signUpSchema";

// It is used to validate the username from the query parameters with zod usernameValidation schema
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

// GET request to get the username from the query parameters and check if it is unique or not
export async function GET(request: Request) {
  // First, connect to the database
  await dbConnect();

  // Try to get the username from the query parameters
  try {
    // Get the searchParams from the request URL
    const { searchParams } = new URL(request.url);

    // Get the queryParam(username) from the searchParams
    const queryParam = {
      username: searchParams.get("username"),
    };

    // Validate the query with zod schema and get the result
    const result = UsernameQuerySchema.safeParse(queryParam);

    // If the result is not successful, return a response with 400 status code
    if (!result.success) {
      // Get the username errors from the result
      const usernameErrors = result.error.format().username?._errors || [];

      // Return a response with 400 status code and error message of usernameErrors
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid username",
        },
        {
          status: 400,
        }
      );
    }

    // If result is successful, get the username from the result data
    const { username } = result.data;

    // Find the user with the username and isVerified as true
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // If the user exists, return a response with 400 status code and message "Username already taken"
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        {
          status: 400,
        }
      );
    }

    // If the user does not exist, return a response with 200 status code and message "Username is available"
    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // If there is an error, log the error and return a response with 500 status code
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
