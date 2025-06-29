/**
 * Usage examples for the Translation API
 * Run with: deno run --allow-net examples.ts
 */

const API_URL = "http://localhost:8000"; // Change to your deployed URL

interface TranslationRequest {
  text: string;
  from?: string;
  to?: string;
}

interface TranslationResponse {
  code: number;
  status: string;
  data: {
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    originalText: string;
  };
}

/**
 * Helper function to make translation requests
 */
async function translate(request: TranslationRequest): Promise<TranslationResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Example usage scenarios
 */
async function runExamples(): Promise<void> {
  console.log("🌍 Translation API Examples\n");

  try {
    // Example 1: Basic translation
    console.log("1️⃣ Basic Translation (English to Spanish)");
    const result1 = await translate({
      text: "Hello, how are you doing today?",
      from: "en",
      to: "es"
    });
    console.log(`   Original: ${result1.data.originalText}`);
    console.log(`   Translated: ${result1.data.translatedText}`);
    console.log(`   Direction: ${result1.data.sourceLanguage} → ${result1.data.targetLanguage}\n`);

    // Example 2: Auto-detect source language
    console.log("2️⃣ Auto-detect Source Language");
    const result2 = await translate({
      text: "Bonjour, comment ça va aujourd'hui?",
      to: "en"
    });
    console.log(`   Original: ${result2.data.originalText}`);
    console.log(`   Translated: ${result2.data.translatedText}`);
    console.log(`   Detected: ${result2.data.sourceLanguage} → ${result2.data.targetLanguage}\n`);

    // Example 3: Default to English
    console.log("3️⃣ Default Target Language (English)");
    const result3 = await translate({
      text: "Hola, ¿cómo estás hoy?"
    });
    console.log(`   Original: ${result3.data.originalText}`);
    console.log(`   Translated: ${result3.data.translatedText}`);
    console.log(`   Direction: ${result3.data.sourceLanguage} → ${result3.data.targetLanguage}\n`);

    // Example 4: Multiple languages
    console.log("4️⃣ Multiple Language Examples");
    
    const examples = [
      { text: "Guten Tag! Wie geht es Ihnen?", to: "en", desc: "German to English" },
      { text: "こんにちは、元気ですか？", to: "en", desc: "Japanese to English" },
      { text: "Ciao, come stai oggi?", to: "fr", desc: "Italian to French" },
      { text: "Привет, как дела?", to: "es", desc: "Russian to Spanish" }
    ];

    for (const example of examples) {
      const result = await translate(example);
      console.log(`   ${example.desc}:`);
      console.log(`   "${result.data.originalText}" → "${result.data.translatedText}"`);
      console.log(`   (${result.data.sourceLanguage} → ${result.data.targetLanguage})\n`);
    }

    console.log("✅ All examples completed successfully!");

  } catch (error) {
    console.error("❌ Error running examples:", error.message);
  }
}

// Run examples
runExamples();
