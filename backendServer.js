// server.js (excerpt)
app.post("/api/gemini", async (req, res) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyD9oWkNoEM47pL_bIbin_D00JwjuH2NUx4";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });
  try {
    const apiResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
    });
    const result = await apiResponse.json();
    if (result.candidates && result.candidates.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      return res.status(200).json({ response: text });
    } else {
      throw new Error("Invalid response from API.");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
