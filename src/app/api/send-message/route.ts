// Importing dbConnect for connecting to the database
import dbConnect from "@/lib/dbConnect";

// Importing UserModel to interact with the user collection in the database
import UserModel from "@/model/User";

// Importing the Message interface which we created to define the message object
import { Message } from "@/model/User";

// Creating and exporting the POST function to send a message to a user
export async function POST(request: Request) {
  // First, connect to the database
  await dbConnect();

  // Get the username and content from the request body
  const { username, content } = await request.json();

  // Try to find the user and send the message
  try {
    // Find the user with the given username
    const user = await UserModel.findOne({ username });

    // If the user is not found, return a not found response
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

    // If the user is found but is not accepting messages, return a forbidden response
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    // If the user is found and is accepting messages, create a new message object
    const newMessage = {
      content,
      createdAt: new Date(),
    };

    // Push the new message to the user's messages array
    user.messages.push(newMessage as Message);

    // Save the user with the new message in the database
    await user.save();

    // Return a success response with a message sent confirmation
    return Response.json(
      {
        success: true,
        message: "Message sent",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // If there is an error, return an error response
    console.log("Error sending message", error);
    return Response.json(
      {
        success: false,
        message: "Error sending message",
      },
      {
        status: 500,
      }
    );
  }
}
