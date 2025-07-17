const express = require("express");
const fetch = (...args) =>
  import('node-fetch').then(({default: fetch}) => fetch(...args));

const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Your API key for exchangeratesapi.io
const API_KEY = "your_api_key";

// Enable CORS
app.use(cors());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Hardcoded currency list
const currencies = [
  "USD", "EUR", "INR", "JPY", "GBP",
  "AUD", "CAD", "CNY", "NZD", "CHF"
];

// Endpoint for currency list
app.get("/api/currencies", (req, res) => {
  console.log("✅ Sending hardcoded currency list.");
  res.json({ success: true, currencies });
});

// Endpoint for currency conversion
app.get("/api/convert", async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: "Missing query parameters." });
  }

  try {
    const apiUrl = `https://api.exchangeratesapi.io/v1/convert?access_key=${API_KEY}&from=${from}&to=${to}&amount=${amount}`;
    console.log(`🔗 Fetching conversion: ${apiUrl}`);

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.success) {
      console.log(`✅ Conversion successful: ${amount} ${from} = ${data.result} ${to}`);
      res.json({
        result: "success",
        conversion_result: data.result
      });
    } else {
      console.error("❌ API error:", data.error);
      res.status(500).json({ error: "API failed to return conversion result." });
    }
  } catch (error) {
    console.error("❌ Server error during conversion:", error.message);
    res.status(500).json({ error: "Server error during conversion." });
  }
});

// Catch-all fallback for frontend (fixes Express v5 wildcard issue)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
