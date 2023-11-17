import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const OpenMeteo_URL = "https://api.open-meteo.com/v1/forecast";
const Nominatim_URL = "https://nominatim.openstreetmap.org/search";

const weatherCodeDict = {0: "images/icons/weather/animated/clear-day.svg",
                         1: "images/icons/weather/animated/clear-day.svg",
                         2: "images/icons/weather/animated/clear-day.svg",
                         3: "images/icons/weather/animated/cloudy.svg",
                         45: "images/icons/weather/animated/fog.svg",
                         48: "images/icons/weather/animated/fog.svg",
                         51: "images/icons/weather/animated/rainy-1.svg",
                         53: "images/icons/weather/animated/rainy-1.svg",
                         55: "images/icons/weather/animated/rainy-1.svg",
                         61: "images/icons/weather/animated/rainy-3.svg",
                         63: "images/icons/weather/animated/rainy-3.svg",
                         80: "images/icons/weather/animated/rainy-2.svg"};

const location = [53.43, -2.91, 'Liverpool', 'Liverpool City Region'];

app.get("/", async (req, res) => {
  try {
    const OpenMeteoConfigA = { params: { latitude: location[0], longitude: location[1], daily: ['sunrise', 'sunset', 'temperature_2m_max', 'temperature_2m_min', 'apparent_temperature_max', 'apparent_temperature_min', 'rain_sum', 'precipitation_probability_mean', 'wind_speed_10m_max', 'uv_index_max', 'weather_code'], forecast_days: 8 } };
    const OpenMeteoConfigB = { params: { latitude: location[0], longitude: location[1], hourly: ['apparent_temperature', 'precipitation_probability', 'weather_code'], forecast_days: 1 } };
    const sevenDayForecast = await axios.get(OpenMeteo_URL, OpenMeteoConfigA);
    // const todayForecast = await axios.get(OpenMeteo_URL, OpenMeteoConfigB);
    //let sunrise_time = new Date(result.data.daily.sunrise[0]).toLocaleString();
    // console.log(sevenDayForecast.data);
    // console.log(todayForecast.data);

    res.render("index.ejs", { sevenDay: sevenDayForecast.data, weatherCodeDict: weatherCodeDict, setLocation: location })
  } catch (error) {
    res.redirect("/");
  }
});

app.post("/submit", async (req, res) => {
	  try {
      const NominatimConfig = { params: { q: req.body.search, format: "geojson", "accept-language": "en"} };
      const tmpLocation = await axios.get(Nominatim_URL, NominatimConfig);
      location[0] = tmpLocation.data.features[0].geometry.coordinates[1];
      location[1] = tmpLocation.data.features[0].geometry.coordinates[0];
      const place = tmpLocation.data.features[0].properties.display_name;
      location[2] = place.slice(0, place.indexOf(","));
      location[3] = place.slice(place.indexOf(",") + 1);
      if (location[3].length > 36) {
        location[3] = location[3].slice(0, 36) + '...';
      }
      console.log(location);
      res.redirect("/");
	  } catch (error) {
      res.redirect("/");
	  }
	});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});