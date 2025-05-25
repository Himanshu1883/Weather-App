// src/Weather.jsx
import React, { useState } from "react";
import axios from "axios";

const API_KEY = "d238084accf94ca0d2977aacbb66ba9c"; // Your OpenWeatherMap API key
const API_URL = "https://api.openweathermap.org/data/2.5/weather"; // OpenWeatherMap API URL
const ICON_URL = (iconCode) => `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

export default function Weather() {
  const [city, setCity] = useState(""); // City input state
  const [weather, setWeather] = useState(null); // Weather data state
  const [error, setError] = useState(null); // Error state to handle error messages
  const [loading, setLoading] = useState(false); // Loading state for API calls

  // Helper function to get weather background class
  const getWeatherBackgroundClass = () => {
    if (!weather) return 'default-bg';
    const weatherMain = weather.weather[0].main.toLowerCase();
    switch (weatherMain) {
      case 'clear':
        return 'clear-bg';
      case 'clouds':
        return 'clouds-bg';
      case 'rain':
      case 'drizzle':
        return 'rain-bg';
      case 'thunderstorm':
        return 'thunderstorm-bg';
      case 'snow':
        return 'snow-bg';
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'fog':
        return 'mist-bg';
      default:
        return 'default-bg';
    }
  };

  // Handle the search and weather data fetching
  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setError(null); // Clear any existing errors
    setLoading(true); // Set loading to true
    setWeather(null); // Clear previous weather data
    console.log("Fetching weather for:", city); // Log the city for debugging

    try {
      const response = await axios.get(API_URL, {
        params: {
          q: city, // City entered by user
          appid: API_KEY, // API Key for authentication
          units: "metric", // Convert temperature to Celsius
        },
      });

      // Log the entire response to see the structure and check for issues
      console.log("API Response:", response.data);

      if (response.data.cod === 200) {
        // Successfully fetched data
        setWeather(response.data); // Update weather state
        setError(null); // Clear any previous errors
      } else {
        // If the API returns an error code (though axios usually throws for non-2xx)
        setError(`City not found: ${city}. Please check the spelling.`);
        setWeather(null);
      }
    } catch (err) {
      // Log and display errors if the API request fails
      console.error("API Error:", err);
      if (err.response && err.response.status === 404) {
        setError(`City not found: ${city}. Please check the spelling.`);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError("Unable to fetch weather data. Please try again later.");
      }
      setWeather(null); // Clear the weather state in case of error
    } finally {
      setLoading(false); // Set loading to false after API call
    }
  };

  const handleClearInput = () => {
    setCity("");
    setWeather(null);
    setError(null);
  };

  return (
    <div className={`weather-container ${getWeatherBackgroundClass()}`}>
      <div className="content-wrapper">
        <h1>Weather App</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)} // Update the city state
            onKeyPress={(e) => { // Allow searching with Enter key
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="city-input"
          />
          {city && (
            <button onClick={handleClearInput} className="clear-input-button">
              &times;
            </button>
          )}
          <button onClick={handleSearch} className="search-button" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              "Get Weather"
            )}
          </button>
        </div>

        {error && <p className="error">{error}</p>} {/* Show any error messages */}

        {!loading && !weather && !error && (
          <p className="no-data-message">Enter a city name to see the weather forecast.</p>
        )}

        {weather && (
          <div className="weather-details fade-in">
            <h2>{weather.name}, {weather.sys.country}</h2> {/* City name and country */}
            <div className="weather-main-info">
              {weather.weather[0].icon && (
                <img
                  src={ICON_URL(weather.weather[0].icon)}
                  alt={weather.weather[0].description}
                  className="weather-icon"
                />
              )}
              <p className="temperature">{Math.round(weather.main.temp)}°C</p> {/* Temperature in Celsius */}
            </div>
            <p className="description-text">{weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}</p> {/* Weather description */}

            <div className="additional-info">
              <div className="info-item">
                <span className="label">Feels Like:</span>
                <span className="value">{Math.round(weather.main.feels_like)}°C</span> {/* Feels like temperature */}
              </div>
              <div className="info-item">
                <span className="label">Humidity:</span>
                <span className="value">{weather.main.humidity}%</span> {/* Humidity percentage */}
              </div>
              <div className="info-item">
                <span className="label">Wind:</span>
                <span className="value">{weather.wind.speed.toFixed(1)} m/s</span> {/* Wind speed */}
              </div>
              <div className="info-item">
                <span className="label">Visibility:</span>
                <span className="value">{(weather.visibility / 1000).toFixed(1)} km</span> {/* Visibility in km */}
              </div>
              <div className="info-item">
                <span className="label">Pressure:</span>
                <span className="value">{weather.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="footer">
        <p>&copy; 2025 Himanshu. All rights reserved.</p>
      </footer>
    </div>
  );
}