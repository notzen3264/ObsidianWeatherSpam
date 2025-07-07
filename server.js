const axios = require("axios");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = "b2a5adcct04b33178913oc335f405433";
const DISPATCH_INTERVAL = 1; // every 1 millisecond
const cities = ["Paris", "Tokyo", "New York", "London", "Berlin"];
let counter = 0;

async function searchCity(city) {
  const url = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url);
    const weather = response.data;
    console.log(`[${city}] Temp: ${weather.temperature.current}°C | Humidity: ${weather.temperature.humidity}%`);
  } catch (err) {
    console.error(`[${city}] Error: ${err.message}`);
  }
}

function startSpamming() {
  setInterval(() => {
    const city = cities[counter % cities.length];
    searchCity(city);
    counter++;
  }, DISPATCH_INTERVAL);
}

app.get("/", (req, res) => {
  res.send("Weather spammer server is running.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  startSpamming();
});
