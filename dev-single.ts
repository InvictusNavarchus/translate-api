/**
 * Development server for the single-file version
 */

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import handler from "./main-single.ts";

console.log("🚀 Starting single-file Translation API...");
console.log("📍 Server running at: http://localhost:8000");

serve(handler, { port: 8000 });
