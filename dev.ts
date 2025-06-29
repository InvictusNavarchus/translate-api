/**
 * Development server for local testing of the serverless translation API
 * Run with: deno run --allow-net --allow-env --watch dev.ts
 */

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import handler from "./main.ts";

/**
 * Start development server
 */
console.log("🚀 Starting Translation API development server...");
console.log("📍 Server running at: http://localhost:8000");
console.log("🔄 Watching for file changes...");

serve(handler, { port: 8000 });
