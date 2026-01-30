import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env manually
const envPath = path.resolve(__dirname, '../.env');
console.log(`Reading .env from: ${envPath}`);

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);

    if (!match || !match[1]) {
        console.error("❌ Could not find VITE_GEMINI_API_KEY in .env");
        process.exit(1);
    }

    const apiKey = match[1].trim();
    console.log("✅ Found API Key (masked):", apiKey.substring(0, 8) + "...");

    const ai = new GoogleGenAI({ apiKey });

    console.log("Listing available models...");
    // Using 'as any' to avoid type issues during quick debug script
    const models = await ai.models.list();

    console.log("\n✅ Available Models:");

    // Try to iterate if it's iterable, otherwise log structure
    try {
        // @ts-ignore
        for await (const model of models) {
            console.log(`- ${model.name}`);
        }
    } catch (e) {
        console.log("Could not iterate models:", models);
    }

} catch (error) {
    console.error("\n❌ API Test Failed:");
    console.error(error);
}
