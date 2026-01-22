
import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAttendanceInsights(user: UserProfile, logs: AttendanceRecord[]) {
  try {
    const summary = logs.map(l => `${l.date}: ${l.status}`).join(", ");
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the UNKLAB Highschool AI Assistant. Analyze this student attendance data: ${summary}. 
      Student name is ${user.fullName}. Provide a very short, futuristic, encouraging insight (max 2 sentences) 
      in a sci-fi "System Status" tone.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "SYSTEM STATUS: OPERATIONAL. ALL MODULES RUNNING NOMINAL.";
  }
}
