/**
 * Simple test script to verify serverless API functionality
 * Make sure to run the dev server first: deno task dev
 * Then run: deno run --allow-net test.ts
 */

const API_BASE_URL = "http://localhost:8000";

interface TestCase {
  name: string;
  body: Record<string, unknown>;
  expectedStatus: number;
}

const testCases: TestCase[] = [
  {
    name: "Basic translation with both languages specified",
    body: {
      text: "Hello, world!",
      from: "en",
      to: "es"
    },
    expectedStatus: 200
  },
  {
    name: "Auto-detect source language",
    body: {
      text: "Bonjour le monde!",
      to: "en"
    },
    expectedStatus: 200
  },
  {
    name: "Default to English translation",
    body: {
      text: "Hola mundo!"
    },
    expectedStatus: 200
  },
  {
    name: "Same language translation",
    body: {
      text: "Hello, world!",
      from: "en",
      to: "en"
    },
    expectedStatus: 200
  },
  {
    name: "Missing text parameter",
    body: {
      from: "en",
      to: "es"
    },
    expectedStatus: 400
  },
  {
    name: "Invalid source language code",
    body: {
      text: "Hello, world!",
      from: "invalid",
      to: "es"
    },
    expectedStatus: 400
  },
  {
    name: "Invalid target language code",
    body: {
      text: "Hello, world!",
      from: "en",
      to: "invalid"
    },
    expectedStatus: 400
  }
];

/**
 * Run a single test case
 */
async function runTest(testCase: TestCase): Promise<void> {
  try {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testCase.body),
    });

    const data = await response.json();
    
    if (response.status === testCase.expectedStatus) {
      console.log(`✅ PASS - Status: ${response.status}`);
      if (response.status === 200 && data.data) {
        console.log(`   Original: ${data.data.originalText}`);
        console.log(`   Translated: ${data.data.translatedText}`);
        console.log(`   ${data.data.sourceLanguage} → ${data.data.targetLanguage}`);
      }
    } else {
      console.log(`❌ FAIL - Expected: ${testCase.expectedStatus}, Got: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    }
  } catch (error) {
    console.log(`❌ ERROR - ${error.message}`);
  }
}

/**
 * Test CORS preflight request
 */
async function testCors(): Promise<void> {
  try {
    console.log(`\n🧪 Testing: CORS preflight request`);
    
    const response = await fetch(API_BASE_URL, {
      method: "OPTIONS",
    });

    if (response.status === 200) {
      console.log(`✅ PASS - CORS preflight status: ${response.status}`);
      const corsHeaders = [
        "access-control-allow-origin",
        "access-control-allow-methods",
        "access-control-allow-headers"
      ];
      
      corsHeaders.forEach(header => {
        const value = response.headers.get(header);
        console.log(`   ${header}: ${value}`);
      });
    } else {
      console.log(`❌ FAIL - Expected: 200, Got: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ ERROR - ${error.message}`);
  }
}

/**
 * Main test runner
 */
async function runTests(): Promise<void> {
  console.log("🚀 Starting Translation API Tests");
  console.log("📍 Testing against: http://localhost:8000");
  console.log("⚠️  Make sure to run 'deno task dev' first!");
  
  // Test CORS first
  await testCors();
  
  // Run all test cases
  for (const testCase of testCases) {
    await runTest(testCase);
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("\n🏁 Tests completed!");
}

// Run tests
runTests();
