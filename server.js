const axios = require("axios");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// SheCodes API
const shecodesKey = "b2a5adcct04b33178913oc335f405433";
const shecodesBase = "https://api.shecodes.io/weather/v1/current";

// OpenWeatherMap API
const openWeatherKey = "a4f791ec3190105377dcfdf1cf72f27d";
const openWeatherBase = "https://api.openweathermap.org/data/2.5/weather";

// Dispatch settings
const cityList = ["London", "Tokyo", "Paris", "New York", "Berlin"];
const DISPATCH_INTERVAL = 10;
let index = 0;

async function querySheCodes(city) {
  const url = `${shecodesBase}?query=${city}&key=${shecodesKey}&units=metric`;
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
    const city = cityList[index % cityList.length];
    console.log(`\n🌍 Dispatching for city: ${city}`);
    await querySheCodes(city);
    await queryOpenWeather(city);
    index++;
  }, DISPATCH_INTERVAL);
}

app.get("/", (req, res) => {
  res.send("Weather spammer server is humming along.");
});

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
  spamApis();
});
