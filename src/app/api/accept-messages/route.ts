// Importing getServerSession from next-auth to get the current user session
import { getServerSession } from "next-auth";

// Importing authOptions which we created, to provide it to getServerSession
import { authOptions } from "../auth/[...nextauth]/options";

// Importing dbConnect to connect to the database
import dbConnect from "@/lib/dbConnect";

// Importing UserModel to interact with the user collection in the database
import UserModel from "@/model/User";

// Importing the User of the next-auth
import { User } from "next-auth";

// Creating and exporting the POST function to update the user status to accept messages
export async function POST(request: Request) {
  // First, connect to the database
  await dbConnect();

  // Get the current user session
  const session = await getServerSession(authOptions);

  // Get the user from the session object
  const user: User = session?.user as User;

  // If the session or user is not available, return an unauthorized response
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  // If the user is available, get the user id
  const userId = user._id;

  // Get the acceptMessages from the request body
  const { acceptMessages } = await request.json();

  // Try to update the user status to accept messages in the database
  try {
    // Find the user by the user id and update the isAcceptingMessage field
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      {
        new: true,
      }
    );

    // If the user is not updated, return a response with a message that the user status is not updated
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        {
          status: 401,
        }
      );
    }

    // If the user status is updated, return a response with a message that the user status is updated and the updated user
    return Response.json(
      {
        success: true,
        message: "User status updated to accept messages",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // If there is an error, log the error and return an error response
    console.log("Failed to update user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

// Creating and exporting the GET function to get the user status to accept messages
export async function GET(request: Request) {
  // First, connect to the database
  await dbConnect();

  // Get the current user session
  const session = await getServerSession(authOptions);

  // Get the user from the session object
  const user: User = session?.user as User;

  // If the session or user is not available, return an unauthorized response
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  // If the user is available, get the user id
  const userId = user._id;

  // Try to get the user status to accept messages from the database
  try {
    // Find the user by the user id
    const foundUser = await UserModel.findById(userId);

    // If the user is not found, return a response with a message that the user is not found
    if (!foundUser) {
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

    // If the user is found, return a response with the user status to accept messages
    return Response.json(
      {
        success: true,
        isAccceptingMessages: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // If there is an error, log the error and return an error response
    console.log("Failed to get user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}
