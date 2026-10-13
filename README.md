# Weather App

A weather app built with React and Vite. It shows current conditions and a 5-day forecast for any city.

**Live demo:** https://weather-app-gwku.vercel.app/

![Weather App screenshot](screenshot.png)

## Features

- Search for any city
- Current temperature, feels-like temperature, humidity and wind speed
- Weather condition description
- 5-day forecast with daily high and low temperatures
- Shows Pune by default when the app opens
- Loading message while data is fetched
- Clear error messages for an unknown city or a network problem

## Tech Stack

- React (Hooks: `useState`, `useEffect`)
- Vite
- CSS
- [Open-Meteo](https://open-meteo.com/) forecast and geocoding APIs (no API key needed)

## Run Locally

```bash
git clone https://github.com/pri453/weather_app.git
cd weather_app
npm install
npm run dev
```

Then open the local address shown in the terminal.
