import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeMeal(mealName: string, description: string, nutrition: { calories: number, protein: number, fat: number, carbs: number }) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請分析這份餐點的營養價值與健康建議：
      餐點名稱：${mealName}
      描述：${description}
      營養資訊：熱量 ${nutrition.calories} kcal, 蛋白質 ${nutrition.protein}g, 脂肪 ${nutrition.fat}g, 碳水 ${nutrition.carbs}g
      
      請以繁體中文回答，包含：
      1. 營養亮點 (這份餐點適合什麼樣的人？)
      2. 專業建議 (如何搭配或調整更健康？)
      3. 適合的族群 (例如：健身者、銀髮族、上班族等)
      
      請用簡潔的條列式回答。`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "抱歉，目前無法進行 AI 分析。請稍後再試。";
  }
}
