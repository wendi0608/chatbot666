/**
 * Service to interact with DeepSeek API
 * DeepSeek supports OpenAI-compatible API format.
 */

const API_URL = "https://api.deepseek.com/chat/completions";

// Try to find the key in various common environment variable names
// Priority: REACT_APP_DEEPSEEK_API_KEY -> DEEPSEEK_API_KEY -> API_KEY
const API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.API_KEY || '';

export const getDeepSeekResponse = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "配置错误：未找到 API Key。请在环境变量中添加 `REACT_APP_DEEPSEEK_API_KEY` 或 `API_KEY`。\n\nConfiguration Error: No API Key found.";
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat", // DeepSeek V3
        messages: [
          {
            role: "system",
            content: "You are a helpful, concise, and friendly AI assistant integrated into a web chat application. Keep your answers reasonably short unless asked for detail."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        stream: false,
        temperature: 1.3 // DeepSeek recommends slightly higher temp for chat
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("DeepSeek API Error:", errorData);
      return `API Error: ${response.status} - ${errorData.error?.message || response.statusText}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I couldn't generate a response.";

  } catch (error) {
    console.error("Network Error:", error);
    return "Sorry, I encountered an error connecting to DeepSeek.";
  }
};