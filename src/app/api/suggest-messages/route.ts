import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Google Generative AI
import { NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Pass the API key directly as a string

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Specify the model

    const result = await model.generateContent(prompt); // Generate content using the prompt

    const responseText = result.response.text(); // Extract the text response
    console.log(responseText);
    return NextResponse.json(responseText); // Return the response as JSON
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json({ error: "Unexpected Error!" }, { status: 500 }); // Handle errors
  }
}
