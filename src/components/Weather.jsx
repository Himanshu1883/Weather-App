// src/Weather.jsx
import React, { useState } from "react";
import axios from "axios";

const API_KEY = "d238084accf94ca0d2977aacbb66ba9c";  // Your OpenWeatherMap API key
const API_URL = "https://api.openweathermap.org/data/2.5/weather";  // OpenWeatherMap API URL

export default function Weather() {
  const [city, setCity] = useState("");  // City input state
  const [weather, setWeather] = useState(null);  // Weather data state
  const [error, setError] = useState(null);  // Error state to handle error messages

  // Handle the search and weather data fetching
  const handleSearch = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    setError(null);  // Clear any existing errors
    console.log("Fetching weather for:", city);  // Log the city for debugging

    try {
      const response = await axios.get(API_URL, {
        params: {
          q: city,  // City entered by user
          appid: API_KEY,  // API Key for authentication
          units: "metric",  // Convert temperature to Celsius
        },
      });

      // Log the entire response to see the structure and check for issues
      console.log("API Response:", response.data);

      if (response.data.cod === 200) {
        // Successfully fetched data
        setWeather(response.data);  // Update weather state
        setError(null);  // Clear any previous errors
      } else {
        // If the API returns an error code
        setError("City not found.");
        setWeather(null);
      }
    } catch (err) {
      // Log and display errors if the API request fails
      console.error("API Error:", err);
      setError("Unable to fetch weather data. Please try again.");
      setWeather(null);  // Clear the weather state in case of error
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}  // Update the city state
        className="city-input"
      />
      <button onClick={handleSearch} className="search-button">
        Get Weather
      </button>

      {error && <p className="error">{error}</p>}  {/* Show any error messages */}

      {weather && (
        <div className="weather-details">
          <h2>{weather.name}, {weather.sys.country}</h2>  {/* City name and country */}
          <p>{weather.weather[0].description}</p>  {/* Weather description */}
          <p>Temperature: {weather.main.temp}°C</p>  {/* Temperature in Celsius */}
          <p>Feels Like: {weather.main.feels_like}°C</p>  {/* Feels like temperature */}
          <p>Humidity: {weather.main.humidity}%</p>  {/* Humidity percentage */}
          <p>Wind: {weather.wind.speed} m/s</p>  {/* Wind speed */}
          <p>Visibility: {weather.visibility / 1000} km</p>  {/* Visibility in km */}
        </div>
      )}
       <footer className="footer">
    <p>&copy; 2025 Himanshu. All rights reserved.</p>
  </footer>
    </div>
  );
}
