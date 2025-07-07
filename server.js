const axios = require("axios");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// API keys and endpoints
const shecodesKeys = [
  "b2a5adcct04b33178913oc335f405433",
  "eac360db5fc86ft86450f3693e73o43f"
];
const openWeatherKey = "a4f791ec3190105377dcfdf1cf72f27d";
const openWeatherBase = "https://api.openweathermap.org/data/2.5/weather";
const shecodesBase = "https://api.shecodes.io/weather/v1/current";

// Config
const cities = ["London", "Tokyo", "Paris", "New York"];
let index = 0;

async function querySheCodes(city, key) {
  const url = `${shecodesBase}?query=${city}&key=${key}&units=metric`;
  console.log(`[SheCodes] Requesting: ${url}`);
  try {
    const response = await axios.get(url);
    console.log(`[SheCodes] Response:`, JSON.stringify(response.data));
  } catch (error) {
    console.error(`[SheCodes] Error: ${error.message}`);
  }
}

async function queryOpenWeather(city) {
  const url = `${openWeatherBase}?q=${city}&appid=${openWeatherKey}&units=metric`;
  console.log(`[OpenWeatherMap] Requesting: ${url}`);
  try {
    const response = await axios.get(url);
    console.log(`[OpenWeatherMap] Response:`, JSON.stringify(response.data));
  } catch (error) {
    console.error(`[OpenWeatherMap] Error: ${error.message}`);
  }
}

function spamApis() {
  setInterval(async () => {
    const city = cities[index % cities.length];
    for (const key of shecodesKeys) {
      await querySheCodes(city, key);
    }
    await queryOpenWeather(city);
    index++;
  }, 1); // ⚠️ Dispatch every 1ms
}

// 🌐 Serve HTML at root
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Weather Spammer Server</title>
      <style>
        body { font-family: sans-serif; background: #f0f0f0; padding: 2rem; }
        h1 { color: #333; }
        p { font-size: 1.1rem; }
      </style>
    </head>
    <body>
      <h1>Weather Spammer Server Is Online</h1>
      <p>API requests are being sent every 1 millisecond.</p>
      <p>Check your server logs to see real-time activity.</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  spamApis();
});
