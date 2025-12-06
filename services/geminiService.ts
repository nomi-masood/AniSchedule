import { GoogleGenAI } from "@google/genai";

// Safely accessing the API key
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const geminiService = {
  /**
   * Generates a short, engaging review or insight for an anime.
   */
  getAnimeInsight: async (title: string, synopsis: string): Promise<string> => {
    if (!apiKey) return "API Key not configured for AI insights.";
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert anime critic. Write a very short (2-3 sentences), punchy, and engaging "Reason to Watch" for the anime "${title}". Use the following synopsis as context: "${synopsis.substring(0, 500)}...". Focus on the vibe, animation style, or unique plot hook. Do not just summarize.`,
      });
      return response.text || "No insights available.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "AI temporarily unavailable.";
    }
  },

  /**
   * Chat bot for recommendations
   */
  askOtakuBot: async (query: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
     if (!apiKey) return "API Key not configured.";

     try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: [
                {
                    role: 'user',
                    parts: [{text: "You are a helpful, enthusiastic anime expert assistant named 'OtakuBot'. You give short, personalized recommendations."}]
                },
                {
                    role: 'model',
                    parts: [{text: "Sugoi! I'd love to help you find your next favorite anime! What are you in the mood for?"}]
                },
                ...history.map(h => ({
                  role: h.role === 'user' ? 'user' : 'model',
                  parts: h.parts
                }))
            ]
        });

        const result = await chat.sendMessage({ message: query });
        return result.text;
     } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "Sorry, I'm having trouble connecting to the anime network right now!";
     }
  }
};
