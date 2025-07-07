const axios = require("axios");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔁 Dispatch frequency
const DISPATCH_INTERVAL = 10;

// 🌍 APIs
const shecodesKeys = [
  "b2a5adcct04b33178913oc335f405433",
  "eac360db5fc86ft86450f3693e73o43f"
];
const openWeatherKey = "a4f791ec3190105377dcfdf1cf72f27d";
const cities = ["London", "Tokyo", "Paris", "New York", "Berlin"];
const shecodesBase = "https://api.shecodes.io/weather/v1/current";
const openWeatherBase = "https://api.openweathermap.org/data/2.5/weather";
let batchCounter = 0;

async function fireSheCodes(city, key) {
  const url = `${shecodesBase}?query=${city}&key=${key}&units=metric`;
  console.log(`[SheCodes] [Key: ${key}] Requesting: ${url}`);
  try {
    const response = await axios.get(url);
    console.log(`[SheCodes] [Key: ${key}] Response:`, JSON.stringify(response.data));
  } catch (err) {
    console.error(`[SheCodes] [Key: ${key}] Error: ${err.message}`);
  }
}

async function fireOpenWeather(city) {
  const url = `${openWeatherBase}?q=${city}&appid=${openWeatherKey}&units=metric`;
  console.log(`[OpenWeatherMap] [Key: ${openWeatherKey}] Requesting: ${url}`);
  try {
    const response = await axios.get(url);
    console.log(`[OpenWeatherMap] [Key: ${openWeatherKey}] Response:`, JSON.stringify(response.data));
  } catch (err) {
    console.error(`[OpenWeatherMap] [Key: ${openWeatherKey}] Error: ${err.message}`);
  }
}

function spamInParallel() {
  setInterval(() => {
    batchCounter++;
    console.log(`\n🚀 Batch #${batchCounter} — ${cities.length} cities × ${shecodesKeys.length + 1} requests`);

    for (const city of cities) {
      // SheCodes with all keys
      for (const key of shecodesKeys) {
        fireSheCodes(city, key);
      }

      // OpenWeatherMap
      fireOpenWeather(city);
    }
  }, DISPATCH_INTERVAL);
}

// 🌐 Serve HTML page at root
app.get("/", (_req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Weather Server is Online</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    body {
      background-color: #121212;
      color: #f0f0f0;
      font-family: 'Inter', sans-serif;
      padding: 2rem;
      line-height: 1.6;
      max-width: 800px;
      margin: auto;
    }

    h1 {
      color: #ffcc00;
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1rem;
      margin: 0.5rem 0;
    }

    ul {
      list-style: none;
      padding-left: 0;
      margin: 0.5rem 0 1.5rem 0;
    }

    li {
      background: #1e1e1e;
      padding: 0.5rem;
      margin-bottom: 0.3rem;
      border-radius: 4px;
    }

    code {
      background: #2c2c2c;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-size: 0.95rem;
      color: #ffcc00;
    }
  </style>
</head>
<body>
  <h1>Weather Server is Online</h1>
  <p>Dispatching requests every <code>${DISPATCH_INTERVAL}</code>ms in parallel.</p>

  <p><strong>SheCodes API Keys:</strong></p>
  <ul>
    ${shecodesKeys.map(k => `<li><code>${k}</code></li>`).join("")}
  </ul>

  <p><strong>OpenWeatherMap Key:</strong></p>
  <code>${openWeatherKey}</code>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server live at http://localhost:${PORT}!`);
  spamInParallel();
});
