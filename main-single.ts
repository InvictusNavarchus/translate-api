/**
 * Serverless translation API handler - Single file version for Deno Deploy
 * This version includes all dependencies inline to avoid import issues
 */

// CORS Headers utility
function getCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
  };
}

// ISO 639-1 language codes validation
const ISO_639_1_CODES = new Set([
  "aa", "ab", "ae", "af", "ak", "am", "an", "ar", "as", "av", "ay", "az",
  "ba", "be", "bg", "bh", "bi", "bm", "bn", "bo", "br", "bs",
  "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy",
  "da", "de", "dv", "dz",
  "ee", "el", "en", "eo", "es", "et", "eu",
  "fa", "ff", "fi", "fj", "fo", "fr", "fy",
  "ga", "gd", "gl", "gn", "gu", "gv",
  "ha", "he", "hi", "ho", "hr", "ht", "hu", "hy", "hz",
  "ia", "id", "ie", "ig", "ii", "ik", "io", "is", "it", "iu",
  "ja", "jv",
  "ka", "kg", "ki", "kj", "kk", "kl", "km", "kn", "ko", "kr", "ks", "ku", "kv", "kw", "ky",
  "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv",
  "mg", "mh", "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my",
  "na", "nb", "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny",
  "oc", "oj", "om", "or", "os",
  "pa", "pi", "pl", "ps", "pt",
  "qu",
  "rm", "rn", "ro", "ru", "rw",
  "sa", "sc", "sd", "se", "sg", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "su", "sv", "sw",
  "ta", "te", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty",
  "ug", "uk", "ur", "uz",
  "ve", "vi", "vo",
  "wa", "wo",
  "xh",
  "yi", "yo",
  "za", "zh", "zu"
]);

/**
 * Validate if a given code is a valid ISO 639-1 language code
 */
function validateLanguageCode(code: string): boolean {
  if (!code || typeof code !== "string") {
    return false;
  }
  return ISO_639_1_CODES.has(code.toLowerCase());
}

interface CopilotResponse {
  code: number;
  status: string;
  response: {
    content: string;
  };
}

/**
 * Detect the language of the given text using the Copilot API
 */
async function detectLanguage(text: string): Promise<string> {
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
    
    if (detectedLanguage.length === 2 && /^[a-z]{2}$/.test(detectedLanguage)) {
      return detectedLanguage;
    }
    
    console.warn(`Invalid language code detected: ${detectedLanguage}, falling back to 'en'`);
    return "en";
    
  } catch (error) {
    console.error("Language detection failed:", error);
    return "en";
  }
}

// Language name mapping for better context
const LANGUAGE_NAMES: Record<string, string> = {
  "en": "English", "es": "Spanish", "fr": "French", "de": "German", "it": "Italian",
  "pt": "Portuguese", "ru": "Russian", "ja": "Japanese", "ko": "Korean", "zh": "Chinese",
  "ar": "Arabic", "hi": "Hindi", "th": "Thai", "vi": "Vietnamese", "tr": "Turkish",
  "pl": "Polish", "nl": "Dutch", "sv": "Swedish", "da": "Danish", "no": "Norwegian",
  "fi": "Finnish", "el": "Greek", "he": "Hebrew", "cs": "Czech", "sk": "Slovak",
  "hu": "Hungarian", "ro": "Romanian", "bg": "Bulgarian", "hr": "Croatian",
  "sr": "Serbian", "sl": "Slovenian", "et": "Estonian", "lv": "Latvian",
  "lt": "Lithuanian", "uk": "Ukrainian", "be": "Belarusian", "ka": "Georgian",
  "hy": "Armenian", "az": "Azerbaijani", "kk": "Kazakh", "ky": "Kyrgyz",
  "uz": "Uzbek", "tg": "Tajik", "mn": "Mongolian", "ne": "Nepali",
  "si": "Sinhala", "my": "Myanmar", "km": "Khmer", "lo": "Lao",
  "am": "Amharic", "sw": "Swahili", "zu": "Zulu", "af": "Afrikaans",
  "sq": "Albanian", "eu": "Basque", "ca": "Catalan", "cy": "Welsh",
  "ga": "Irish", "is": "Icelandic", "mt": "Maltese", "mk": "Macedonian"
};

/**
 * Get language name from ISO code
 */
function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code.toLowerCase()] || code.toUpperCase();
}

/**
 * Translate text using the Copilot API
 */
async function translateText(text: string, from: string, to: string): Promise<string> {
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

/**
 * Serverless handler for the translation API - Single file version
 * @param req - The incoming HTTP request
 * @returns Promise<Response> - The HTTP response
 */
async function handler(req: Request): Promise<Response> {
  const corsHeaders = getCorsHeaders();

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  try {
    // Only allow POST requests for translation
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ 
          error: "Method not allowed. Use POST.", 
          code: 405 
        }),
        { 
          status: 405, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const body = await req.json();
    const { text, from, to = "en" } = body;

    // Validate required text parameter
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "Missing or invalid 'text' parameter", 
          code: 400 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate language codes if provided
    if (from && !validateLanguageCode(from)) {
      return new Response(
        JSON.stringify({ 
          error: `Invalid 'from' language code: ${from}`, 
          code: 400 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!validateLanguageCode(to)) {
      return new Response(
        JSON.stringify({ 
          error: `Invalid 'to' language code: ${to}`, 
          code: 400 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Auto-detect source language if not provided
    let sourceLanguage = from;
    if (!sourceLanguage) {
      sourceLanguage = await detectLanguage(text);
    }

    // Skip translation if source and target are the same
    if (sourceLanguage === to) {
      return new Response(
        JSON.stringify({
          code: 200,
          status: "Success",
          data: {
            translatedText: text,
            sourceLanguage,
            targetLanguage: to,
            originalText: text
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Perform translation
    const translatedText = await translateText(text, sourceLanguage, to);

    return new Response(
      JSON.stringify({
        code: 200,
        status: "Success",
        data: {
          translatedText,
          sourceLanguage,
          targetLanguage: to,
          originalText: text
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Translation API Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        code: 500,
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
}

// Export the handler for Deno Deploy
export default handler;
