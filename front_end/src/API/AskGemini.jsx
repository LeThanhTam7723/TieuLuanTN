import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDQEubbq_-GrA0VQ_AGYmOPDqgJv-V-iM4");

export async function askGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // model hợp lệ
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lỗi gọi API Gemini";
  }
}
