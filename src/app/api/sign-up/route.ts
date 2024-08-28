// Importing dbConnect from mysterymessage/src/lib/dbConnect to connect to the database
import dbConnect from "@/lib/dbConnect";

// Importing UserModel from mysterymessage/src/model/User to interact with the User model in the database
import UserModel from "@/model/User";

// Importing bcrypt from bcryptjs to hash the password
import bcrypt from "bcryptjs";

// Importing sendVerificationEmail from mysterymessage/src/helpers/sendVerificationEmail to send the verification email
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// Creating and exporting the POST function to sign-up a new user
// The function takes a request object as an argument which itself comes from NextJS
export async function POST(request: Request) {
  // First connect to the database
  await dbConnect();

  try {
    // Desctructure the username, email, and password from the request body
    const { username, email, password } = await request.json();

    // Check if the username is already taken and verified
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // If the username is already taken and verified, return a response that the username is already taken
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Check if the email is already taken
    const existingUserByEmail = await UserModel.findOne({ email });

    // Generate a random 6 digit verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // If the email is already taken, check if the user is already verified
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // If the user is already verified, return a response that the email is already taken
        return Response.json(
          {
            success: false,
            message: "Email is already taken",
          },
          { status: 400 }
        );
      } else {
        // If the user is not verified, hash the password and update the user's password, verification code and expiry date
        const hasedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hasedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save(); // Save the updated user
      }
    } else {
      // If the email is not taken, hash the password and create a new user with the username, email, password, verification code, expiry date, and other default values
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      // Save the new user
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    // If the email is not sent successfully, return a response with a status of 500
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    // If the email is sent successfully, return a response with a status of 201
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    // If there is an error, log the error and return a response with a status of 500
    console.error("Error registering user", error);
    // Response.json is a function that returns a response with a JSON object
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
