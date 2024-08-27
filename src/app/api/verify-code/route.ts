// Importing dbConnect to connect to the database
import dbConnect from "@/lib/dbConnect";

// Importing UserModel to interact with the user in the database
import UserModel from "@/model/User";

// POST request to verify the user with the username and code
export async function POST(request: Request) {
  // Connecting to the database
  await dbConnect();

  // Parsing the request body to get the username and code
  try {
    // Parsing the request body to get the username and code
    const { username, code } = await request.json();

    // Decoding the username to get the actual username
    const decodedUsername = decodeURIComponent(username);

    // Finding the user with the username in the database
    const user = await UserModel.findOne({ username: decodedUsername });

    // If the user is not found, return a response with status 404 and message "User not found"
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check if the code from the request is the same as the code in the database
    const isCodeValid = user.verifyCode === code;

    // Check if the code in the database is not expired
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    // If the code is valid and not expired, set the user as verified and save the user
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      // Return a response with status 200 and message "User verified successfully"
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      // If the code is expired, return a response with status 400 and message "Verification code expired"
      return Response.json(
        {
          success: false,
          message: "Verification code expired",
        },
        {
          status: 400,
        }
      );
    } else {
      // If the code is invalid, return a response with status 400 and message "Invalid verification code"
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    // If there is an error, log the error and return a response with status 500 and message "Error verifying user"
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
