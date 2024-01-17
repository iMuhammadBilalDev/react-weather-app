import React, { useState, useEffect } from 'react';
import { FaThermometerHalf, FaCloud, FaWind, FaCloudShowersHeavy } from 'react-icons/fa';
import { FaSun, FaMoon, FaCloud as FaCloudIcon, FaCloudShowersHeavy as FaCloudShowersHeavyIcon, FaBolt, FaSnowflake, FaSmog } from 'react-icons/fa';
import Calendar from '../calendar/calendar';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [showWeather, setShowWeather] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [dailyForecast, setDailyForecast] = useState([]);
 
  
  const apiKey = '29448ce31c2605853d6860de8af4d98f';

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d':
        return <FaSun />;
      case '01n':
        return <FaMoon />;
      case '02d':
      case '02n':
        return <FaCloudIcon />;
      case '03d':
      case '03n':
        return <FaCloudIcon />;
      case '04d':
      case '04n':
        return <FaCloudIcon />;
      case '09d':
      case '09n':
        return <FaCloudShowersHeavyIcon />;
      case '10d':
      case '10n':
        return <FaCloudShowersHeavyIcon />;
      case '11d':
      case '11n':
        return <FaBolt />;
      case '13d':
      case '13n':
        return <FaSnowflake />;
      case '50d':
      case '50n':
        return <FaSmog />;
      default:
        return null;
    }
  };
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        if (city.trim() !== '') {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/find?q=${city}&type=like&sort=population&cnt=5&appid=${apiKey}`
          );

          const filteredData = response.data.list.map((item) => item.name);

          setSuggestions(filteredData);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [city, apiKey]);

  const fetchData = async () => {
    try {
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&datetime=${selectedDate}&appid=${apiKey}&units=metric`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      setWeatherData(currentWeatherResponse.data);

      const next5DaysForecast = forecastResponse.data.list.filter(
        (item, index, array) => {
          const currentDate = new Date(item.dt * 1000).toLocaleDateString();
          const nextDate = index + 1 < array.length ? new Date(array[index + 1].dt * 1000).toLocaleDateString() : null;
          return currentDate !== nextDate;
        }
      );

      setDailyForecast(next5DaysForecast);
      setError(null);
      setShowWeather(true);
      setSuggestions([]);
    } catch (error) {
      setError('City not found for the selected date');
      setWeatherData(null);
      setDailyForecast([]);
      setShowWeather(false);
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (city.trim() !== '') {
      fetchData();
    }
  };

  const handleSuggestionClick = (selectedCity) => {
    setCity(selectedCity);
    fetchData();
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&datetime=${date}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
      setError(null);
      setShowWeather(true);
      setSuggestions([]);
    } catch (error) {
      setError('City not found for the selected date');
      setWeatherData(null);
      setShowWeather(false);
      setSuggestions([]);
    }
  };
  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

  return (
    <div className="weather-container">
      <div>
        <Calendar onDateSelect={handleDateSelect} />
      </div>
      <div className="weather-card">
        <div className="search-form">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions">
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {showWeather && weatherData && (
          <div className="weather-info">
            <h2>{weatherData.name}</h2>
            <h3>{weatherData.weather[0].main}</h3>
            <p>
              <FaThermometerHalf /> Temperature: {weatherData.main.temp}°C
            </p>
            <p>
              <FaCloud  /> Condition: {weatherData.weather[0].description}
            </p>
            <p>
              <FaWind /> Wind: {weatherData.wind.speed} m/s
            </p>
            {weatherData.rain && (
              <p>
                <FaCloudShowersHeavy /> Chance of Rain: {weatherData.rain['1h']} mm
              </p>
            )}
          </div>
        )}

        {showWeather && dailyForecast.length > 0 && (
          <div className="forecast-info">
            <h3>5-Day Forecast:</h3>
            <ul>
  {dailyForecast.map((item, index) => (
    <li key={index}>
      {formatDate(item.dt)}: {item.main.temp}°C, {item.weather[0].description}{" "}
      {getWeatherIcon(item.weather[0].icon)}
    </li>
  ))}
</ul>

          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
