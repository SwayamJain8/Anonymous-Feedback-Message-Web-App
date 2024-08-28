// "use client" is a special comment that tells the bundler to use the client bundle instead of the server bundle for the following imports in the same file. This is useful for importing client-side only packages like react, react-dom, and next/link in a file that is shared between the client and server bundles. This comment is only needed in files that are shared between the client and server bundles. Files that are only imported in the client bundle do not need this comment. Files that are only imported in the server bundle should not use this comment.
"use client";

// Importing zodResolver for zod schema validation
import { zodResolver } from "@hookform/resolvers/zod";

// Importing useForm from react-hook-form for form handling
import { useForm } from "react-hook-form";

// Importing * as z from zod for zod schema validation
import * as z from "zod";

// Importing Link from next/link for client side navigation
import Link from "next/link";

// Importing useEffect and useState hooks from react for side effects and state management
import { useEffect, useState } from "react";

// Importing useDebounceValue and useDebounceCallback hooks from usehooks-ts for debouncing values and callbacks
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";

// Importing useToast hook from "@/components/ui/use-toast for showing toasts
import { useToast } from "@/components/ui/use-toast";

// Importing useRouter hook from next/navigation for client side navigation
import { useRouter } from "next/navigation";

// Importing signUpSchema from "@/schemas/signUpSchema for zod schema validation of sign up form
import { signUpSchema } from "@/schemas/signUpSchema";

// Importing axios for making http requests
import axios, { AxiosError } from "axios";

// Importing ApiResponse from "@/types/ApiResponse for defining the response type of the API response from the server
import { ApiResponse } from "@/types/ApiResponse";

// Importing Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage from "@/components/ui/form for form components like form, input, label, message, etc.
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Importing Input from "@/components/ui/input for input component
import { Input } from "@/components/ui/input";

// Importing Button from "@/components/ui/button for button component
import { Button } from "@/components/ui/button";

// Importing Loader2 from lucide-react for loader icon component
import { Loader2 } from "lucide-react";

// Defining the page component for the sign up page with the form to sign up a user
const page = () => {
  // Defining the username state variable for the username input field
  const [username, setUsername] = useState("");

  // Defining the usernameMessage state variable for the message to show if the username is unique or not
  const [usernameMessage, setUsernameMessage] = useState("");

  // Defining the isCheckingUsername state variable to check if the username is being checked for uniqueness (Loading state)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Defining the isSubmitting state variable to check if the form is being submitted (Loading state)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Using the useDebounceCallback hook to debounce the setUsername function with a delay of 300ms
  const debounced = useDebounceCallback(setUsername, 300);

  // Using the useToast hook to get the toast function for showing toasts
  const { toast } = useToast();

  // Using the useRouter hook to get the router object for client side navigation
  const router = useRouter();

  // Using the useForm hook to get the form object with the zodResolver and default values for the sign up form
  const form = useForm<z.infer<typeof signUpSchema>>({
    // Using the zodResolver for the sign up schema for form validation
    resolver: zodResolver(signUpSchema),
    // Defining the default values for the sign up form fields
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Using the useEffect hook to check if the username is unique when the username is changed and show the message accordingly
  useEffect(() => {
    // Defining the checkUsernameUnique async function to check if the username is unique by making an API request to the server with the username as a query parameter
    const checkUsernameUnique = async () => {
      // If the username is not empty then...
      if (username) {
        // Setting the isCheckingUsername state variable to true to show the loading state
        setIsCheckingUsername(true);
        // Resetting the usernameMessage state variable to an empty string
        setUsernameMessage("");

        // Try to make an API request to the server to check if the username is unique
        try {
          // Making a GET request to the server with the username as a query parameter to check if the username is unique and getting the response
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          // Setting the usernameMessage state variable to the message from the response
          setUsernameMessage(response.data.message);
        } catch (error) {
          // Catching any error that occurs during the API request and setting the usernameMessage state variable to the error message
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || "An error occurred"
          );
        } finally {
          // Setting the isCheckingUsername state variable to false to hide the loading state
          setIsCheckingUsername(false);
        }
      }
    };
    // Calling the checkUsernameUnique function when the username is changed
    checkUsernameUnique();
  }, [username]);

  // Defining the onSubmit async function to handle the form submission and sign up the user by making an API request to the server
  // The function takes the form data of type signUpSchema as an argument
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    // Setting the isSubmitting state variable to true to show the loading state
    setIsSubmitting(true);

    // Try to make an API request to the server to sign up the user with the form data
    try {
      // Making a POST request to the server with the form data to sign up the user and getting the response
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      // Showing a success toast with the message from the response if the sign up is successful
      toast({
        title: "Success",
        description: response.data.message,
      });

      // Navigating to the verify page with the username as a query parameter to verify the user's email
      router.replace(`/verify/${username}`);

      // Setting the isSubmitting state variable to false to hide the loading state
      setIsSubmitting(false);
    } catch (error) {
      // Catching any error that occurs during the API request and showing an error toast with the error message if the sign up fails
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message || "An error occurred";
      toast({
        title: "Signup Failed",
        description: errorMessage,
        // Setting the variant to destructive for an error toast
        variant: "destructive",
      });

      // Setting the isSubmitting state variable to false to hide the loading state
      setIsSubmitting(false);
    }
  };

  // Returning the sign up form with the form fields for username, email, and password and the submit button to sign up the user
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        {/* Using the Form component for the signup form accepting {...form} from useform() which we declared above */}
        <Form {...form}>
          {/* Using the form component to handle the form submission using handleSubmit event accepting onSubmit function which we created above */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Using the FormField component to handle the username input field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        {
                          /* Setting the username state variable to the value of the username input field */
                        }
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>

                  {/* Showing the loader icon if the username is being checked for uniqueness */}
                  {isCheckingUsername && <Loader2 className="animate-spin" />}

                  {/* Showing the message if the username is unique or not */}
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage} {/* Showing the message accordingly */}
                  </p>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Using the FormField component to handle the email input field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Using the FormField component to handle the password input field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Using Button component for the submit button according to the isSubmitting state */}
            <Button type="submit" disabled={isSubmitting}>
              {/* If isSubmitting is true then showing the loader icon and "Please wait" text but if false then show Sign Up button */}
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        {/* If the user is already a member then show the sign in link */}
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Exporting the page component
export default page;
