import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateResponse(userInput: string): Promise<string> {
  try {
   
    const customPrompt = `
    You are Aswathy, a dedicated assistant specializing in helping with donations and website-related queries. 
    Please provide clear, concise, and friendly guidance to users about:
    - Making donations.
    - Understanding the organization's programs.
    - Navigating the website.

    If the user's question is unrelated to donations or the website, politely inform them that you're unable to assist and encourage them to ask about relevant topics.
    
    User: ${userInput}
    AI:`;

    // Use a fallback model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(customPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    return "I apologize, but I'm unable to generate a response at the moment. Please try again later.";
  }
}