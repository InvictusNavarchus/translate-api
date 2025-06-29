/**
 * Language detection service using the Copilot API
 */

interface CopilotResponse {
  code: number;
  status: string;
  response: {
    content: string;
  };
}

/**
 * Detect the language of the given text using the Copilot API
 * @param text - Text to detect language for
 * @returns Promise<string> - ISO 639-1 language code
 */
export async function detectLanguage(text: string): Promise<string> {
  const systemPrompt = `You are a language detection expert. Your task is to detect the language of the given text and return ONLY the ISO 639-1 language code (2 letters, lowercase). 

Rules:
- Return ONLY the 2-letter ISO 639-1 code
- No explanations, no additional text
- If uncertain, return your best guess
- For mixed languages, return the dominant language
- Common codes: en (English), es (Spanish), fr (French), de (German), it (Italian), pt (Portuguese), ru (Russian), ja (Japanese), ko (Korean), zh (Chinese), ar (Arabic), hi (Hindi), etc.`;

  const userPrompt = `Detect the language of this text: "${text}"`;

  try {
    const response = await fetch("https://api.zpi.my.id/v1/ai/copilot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stream: "false",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Copilot API error: ${response.status}`);
    }

    const data: CopilotResponse = await response.json();
    
    if (data.code !== 200 || !data.response?.content) {
      throw new Error("Invalid response from Copilot API");
    }

    const detectedLanguage = data.response.content.trim().toLowerCase();
    
    // Validate the returned language code
    if (detectedLanguage.length === 2 && /^[a-z]{2}$/.test(detectedLanguage)) {
      return detectedLanguage;
    }
    
    // Fallback to English if detection fails
    console.warn(`Invalid language code detected: ${detectedLanguage}, falling back to 'en'`);
    return "en";
    
  } catch (error) {
    console.error("Language detection failed:", error);
    // Fallback to English on error
    return "en";
  }
}
