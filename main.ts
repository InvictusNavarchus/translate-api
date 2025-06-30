import { getCorsHeaders } from "./utils/cors.ts";
import { translateText } from "./services/translator.ts";
import { detectLanguage } from "./services/language-detector.ts";
import { validateLanguageCode } from "./utils/validation.ts";

/**
 * Serverless handler for the translation API
 * Handles CORS, validates parameters, and orchestrates translation
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

// Also export as named export for compatibility
export { handler };