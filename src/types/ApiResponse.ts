// Importing the Message model from mysterymessage/src/model/User.ts to use in the ApiResponse interface
import { Message } from "../model/User";

// Creating and Exporting the interface of an ApiResponse to define the shape of the response from the API
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
