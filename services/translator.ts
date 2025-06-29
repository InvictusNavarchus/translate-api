/**
 * Translation service using the Copilot API
 */

interface CopilotResponse {
  code: number;
  status: string;
  response: {
    content: string;
  };
}

// Language name mapping for better context
const LANGUAGE_NAMES: Record<string, string> = {
  "en": "English",
  "es": "Spanish",
  "fr": "French",
  "de": "German",
  "it": "Italian",
  "pt": "Portuguese",
  "ru": "Russian",
  "ja": "Japanese",
  "ko": "Korean",
  "zh": "Chinese",
  "ar": "Arabic",
  "hi": "Hindi",
  "th": "Thai",
  "vi": "Vietnamese",
  "tr": "Turkish",
  "pl": "Polish",
  "nl": "Dutch",
  "sv": "Swedish",
  "da": "Danish",
  "no": "Norwegian",
  "fi": "Finnish",
  "el": "Greek",
  "he": "Hebrew",
  "cs": "Czech",
  "sk": "Slovak",
  "hu": "Hungarian",
  "ro": "Romanian",
  "bg": "Bulgarian",
  "hr": "Croatian",
  "sr": "Serbian",
  "sl": "Slovenian",
  "et": "Estonian",
  "lv": "Latvian",
  "lt": "Lithuanian",
  "uk": "Ukrainian",
  "be": "Belarusian",
  "ka": "Georgian",
  "hy": "Armenian",
  "az": "Azerbaijani",
  "kk": "Kazakh",
  "ky": "Kyrgyz",
  "uz": "Uzbek",
  "tg": "Tajik",
  "mn": "Mongolian",
  "ne": "Nepali",
  "si": "Sinhala",
  "my": "Myanmar",
  "km": "Khmer",
  "lo": "Lao",
  "am": "Amharic",
  "sw": "Swahili",
  "zu": "Zulu",
  "af": "Afrikaans",
  "sq": "Albanian",
  "eu": "Basque",
  "ca": "Catalan",
  "cy": "Welsh",
  "ga": "Irish",
  "is": "Icelandic",
  "mt": "Maltese",
  "mk": "Macedonian"
};

/**
 * Get language name from ISO code, fallback to code if not found
 * @param code - ISO 639-1 language code
 * @returns Language name or code
 */
function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code.toLowerCase()] || code.toUpperCase();
}

/**
 * Translate text from source language to target language using the Copilot API
 * @param text - Text to translate
 * @param from - Source language ISO 639-1 code
 * @param to - Target language ISO 639-1 code
 * @returns Promise<string> - Translated text
 */
export async function translateText(text: string, from: string, to: string): Promise<string> {
  const fromLanguage = getLanguageName(from);
  const toLanguage = getLanguageName(to);
  
  const systemPrompt = `You are a professional translator with expertise in multiple languages. Your task is to translate text accurately while preserving the original meaning, tone, and context.

Rules:
- Translate the given text from ${fromLanguage} to ${toLanguage}
- Maintain the original tone and style
- Preserve any formatting, punctuation, and special characters
- For technical terms, use the most appropriate equivalent
- For proper nouns, keep them as-is unless they have established translations
- Return ONLY the translated text, no explanations or additional content
- If the text is already in the target language, return it unchanged
- Handle idioms and cultural references appropriately`;

  const userPrompt = `Translate this ${fromLanguage} text to ${toLanguage}: "${text}"`;

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
      throw new Error(`Copilot API error: ${response.status} ${response.statusText}`);
    }

    const data: CopilotResponse = await response.json();
    
    if (data.code !== 200 || !data.response?.content) {
      throw new Error(`Invalid response from Copilot API: ${JSON.stringify(data)}`);
    }

    const translatedText = data.response.content.trim();
    
    if (!translatedText) {
      throw new Error("Empty translation received from Copilot API");
    }
    
    return translatedText;
    
  } catch (error) {
    console.error("Translation failed:", error);
    throw new Error(`Translation failed: ${error.message}`);
  }
}
