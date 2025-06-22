/*
* This is an example of a serverless cloud function (e.g., for Netlify, Vercel, or Google Cloud Functions).
* It acts as a secure proxy to the Gemini API.
*
* How to use:
* 1. Deploy this function to a cloud provider.
* 2. Get the public URL for the deployed function.
* 3. Paste that URL into the 'YOUR_CLOUD_FUNCTION_URL' variable in your index.html file.
*/

// Example using a generic structure. The exact syntax might change slightly
// depending on your cloud provider (e.g., Netlify uses `exports.handler`).
export default async function handler(req, res) {
    // --- Security: Allow requests only from your app's domain in production ---
    res.setHeader('Access-Control-Allow-Origin', '*'); // For development. Tighten this in production!
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight CORS requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // --- Secure API Key Storage ---
    // The API key is stored securely on the server, never exposed to the client/app.
    const GEMINI_API_KEY = "AIzaSyCwnHcIJFVkx
        ";
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const apiResponse = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
        });

        if (!apiResponse.ok) {
            throw new Error(`API Error: ${apiResponse.status}`);
        }

        const result = await apiResponse.json();

        if (result.candidates && result.candidates.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            // Send the successful response back to the app
            return res.status(200).json({ response: text });
        } else {
            throw new Error("Invalid response from API.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return res.status(500).json({ error: `Server error: ${error.message}` });
    }
}
