import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

const API_URL = "https://api.open-meteo.com/v1/forecast";
let lat = 53.43;
let lon = -2.91;

const weatherCodeDict = {0: "images/icons/weather/animated/clear-day.svg",
                         1: "images/icons/weather/animated/clear-day.svg",
                         2: "images/icons/weather/animated/clear-day.svg",
                         3: "images/icons/weather/animated/cloudy.svg",
                         51: "images/icons/weather/animated/rainy-1.svg",
                         53: "images/icons/weather/animated/rainy-1.svg",
                         61: "images/icons/weather/animated/rainy-3.svg",
                         80: "images/icons/weather/animated/rainy-2.svg"};

app.get("/", async (req, res) => {
  const configA = { params: { latitude: lat, longitude: lon, daily: ['sunrise', 'sunset', 'temperature_2m_max', 'temperature_2m_min', 'apparent_temperature_max', 'apparent_temperature_min', 'rain_sum', 'weather_code'], forecast_days: 8 } };
  const configB = { params: { latitude: lat, longitude: lon, hourly: ['apparent_temperature', 'precipitation_probability', 'weather_code'], forecast_days: 1 } };
  try {
    const sevenDayForecast = await axios.get(API_URL, configA);
    // const todayForecast = await axios.get(API_URL, configB);
    //let sunrise_time = new Date(result.data.daily.sunrise[0]).toLocaleString();
    console.log(sevenDayForecast.data);
    // console.log(todayForecast.data);

    res.render("index.ejs", { sevenDay: sevenDayForecast.data, weatherCodeDict: weatherCodeDict })
  } catch (error) {
    res.render("index.ejs")
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});