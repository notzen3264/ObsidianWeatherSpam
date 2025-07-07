const axios = require("axios");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔁 Dispatch frequency
const DISPATCH_INTERVAL = 100;

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
    <html>
    <head>
      <title>Weather Spammer Server</title>
      <style>
        body { background: #1b1b1b; color: #eee; font-family: sans-serif; padding: 2rem; }
        h1 { color: #ffdd57; }
      </style>
    </head>
    <body>
      <h1>Weather Spammer Server Online</h1>
      <p>Dispatching requests every ${DISPATCH_INTERVAL}ms in parallel.</p>
      <p>SheCodes API Keys:</p>
      <ul>
        ${shecodesKeys.map(k => `<li><code>${k}</code></li>`).join("")}
      </ul>
      <p>OpenWeatherMap Key:</p>
      <code>${openWeatherKey}</code>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server live at http://localhost:${PORT}!`);
  spamInParallel();
});
