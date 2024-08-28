// Import getServerSession from next-auth to get the current user session
import { getServerSession } from "next-auth";

// Import the authOptions which we created, to provide it to getServerSession
import { authOptions } from "../auth/[...nextauth]/options";

// Import dbConnect to connect to the database
import dbConnect from "@/lib/dbConnect";

// Import UserModel to interact with the user collection in the database
import UserModel from "@/model/User";

// Import the User of the next-auth
import { User } from "next-auth";

// Import mongoose to use its Types to get the user id as an ObjectId
import mongoose from "mongoose";

// Creating and exporting the GET function to get the messages of the user
export async function GET(request: Request) {
  // First, connect to the database
  await dbConnect();

  // Get the current user session
  const session = await getServerSession(authOptions);

  // console.log(session);

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

  // If the user is available, get the user id as an ObjectId using mongoose Types
  const userId = new mongoose.Types.ObjectId(user._id);

  // Try to get the messages of the user from the database
  try {
    // MongoDB aggregation pipeline to get the messages of the user in array format
    const user = await UserModel.aggregate([
      // Match the user id
      { $match: { id: userId } },
      // Unwind the messages array to get each message as a separate document
      { $unwind: "$messages" },
      // Sort the messages based on the createdAt field in descending order
      { $sort: { "messages.createdAt": -1 } },
      // Group the messages based on the user id and push the messages into an array called messages
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    // If the user is not found, return a not found response
    if (!user || user.length === 0) {
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

    // If the user is found, return the messages of the user
    return Response.json(
      {
        success: true,
        // Return the messages array of the user
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // If there is an error, return an error response
    return Response.json(
      {
        success: false,
        message: "Unexpected error occurred while getting messages",
      },
      {
        status: 500,
      }
    );
  }
}
