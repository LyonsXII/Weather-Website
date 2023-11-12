import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

const API_URL = "https://api.open-meteo.com/v1/forecast";
let lat = 53.43;
let lon = -2.91;

app.get("/", async (req, res) => {
  const configA = { params: { latitude: lat, longitude: lon, daily: ['sunrise', 'sunset', 'apparent_temperature_max', 'apparent_temperature_min', 'rain_sum', 'weather_code'], forecast_days: 7 } };
  const configB = { params: { latitude: lat, longitude: lon, hourly: ['apparent_temperature', 'precipitation_probability', 'weather_code'], forecast_days: 1 } };
  try {
    const sevenDayForecast = await axios.get(API_URL, configA);
    // const todayForecast = await axios.get(API_URL, configB);
    //let sunrise_time = new Date(result.data.daily.sunrise[0]).toLocaleString();
    // console.log(sevenDayForecast.data);
    // console.log(todayForecast.data);
    res.render("index.ejs", { weather: sevenDayForecast.data })
  } catch (error) {
    res.render("index.ejs")
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});