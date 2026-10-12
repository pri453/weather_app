import { useState, useEffect } from "react";
import "./App.css";

const CONDITIONS = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};

const describe = (code) => CONDITIONS[code] ?? "Unknown";

function App() {
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState({ name: "Pune", country: "India", latitude: 18.5204, longitude: 73.8567 });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWeather() {
      setLoading(true);
      setError("");
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
          `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather service is not responding.");
        setWeather(await res.json());
      } catch (err) {
        setError(err.message || "Could not load the weather.");
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [place]);

  async function handleSearch(e) {
    e.preventDefault();
    const city = query.trim();
    if (!city) return;
    setError("");
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      );
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        setError(`No city found for "${city}". Check the spelling and try again.`);
        return;
      }
      setPlace(data.results[0]);
      setQuery("");
    } catch {
      setError("Could not search for that city. Check your internet connection.");
    }
  }

  const current = weather?.current;
  const daily = weather?.daily;

  return (
    <main className="app">
      <form className="search" onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city"
          aria-label="City name"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="message error">{error}</p>}
      {loading && <p className="message">Loading weather…</p>}

      {!loading && current && (
        <>
          <section className="now">
            <h1 className="city">
              {place.name}
              {place.country ? `, ${place.country}` : ""}
            </h1>
            <p className="temp">{Math.round(current.temperature_2m)}°</p>
            <p className="condition">{describe(current.weather_code)}</p>
            <dl className="details">
              <div>
                <dt>Feels like</dt>
                <dd>{Math.round(current.apparent_temperature)}°C</dd>
              </div>
              <div>
                <dt>Humidity</dt>
                <dd>{current.relative_humidity_2m}%</dd>
              </div>
              <div>
                <dt>Wind</dt>
                <dd>{Math.round(current.wind_speed_10m)} km/h</dd>
              </div>
            </dl>
          </section>

          <section className="forecast" aria-label="Five day forecast">
            {daily.time.slice(1).map((date, i) => (
              <div className="day" key={date}>
                <p className="day-name">
                  {new Date(date).toLocaleDateString("en-IN", { weekday: "short" })}
                </p>
                <p className="day-condition">{describe(daily.weather_code[i + 1])}</p>
                <p className="day-temps">
                  {Math.round(daily.temperature_2m_max[i + 1])}°
                  <span> / {Math.round(daily.temperature_2m_min[i + 1])}°</span>
                </p>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}

export default App;
