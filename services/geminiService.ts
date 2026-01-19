
import { GoogleGenAI } from "@google/genai";

export async function getShapeInsight(shapeName: string, area: number, perimeter: number): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain the geometric properties of a ${shapeName} with an area of ${area.toFixed(2)} and a perimeter of ${perimeter.toFixed(2)}. Provide a brief interesting fact or practical application for this shape in architecture or engineering.`,
      config: {
        systemInstruction: "You are a geometric expert and educator. Keep responses concise, professional, and insightful. Use Markdown for formatting.",
        temperature: 0.7,
      },
    });
    return response.text || "Could not generate insight at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The geometry assistant is currently resting. Feel free to try again later!";
  }
}
