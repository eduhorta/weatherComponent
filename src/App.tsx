import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  interface WeatherData {
    name: string;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: { main: string }[];
    rain?: {
      '1h': number;
    };
    wind: {
      speed: number;
    };
  }

  const [data, setData] = useState<Partial<WeatherData>>(() => {
    const savedData = localStorage.getItem('weatherData');
    return savedData ? JSON.parse(savedData) : {};
  });
  const saveDataToLocalStorage = (data: Partial<WeatherData>) => {
    localStorage.setItem('weatherData', JSON.stringify(data));
  };
  const [location, setLocation] = useState('');
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location},br&APPID=1a26b8eadf51832de229c54d805a278c`;

  const searchLocation = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data);
        saveDataToLocalStorage(response.data);
      });
      setLocation('');
    }
  };

  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  useEffect(() => {
    if (data.weather) {
      switch (data.weather[0].main) {
        case 'Thunderstorm':
          setBackgroundImage('./src/assets/images/thunder.jpeg');
          break;
        case 'Drizzle':
        case 'Rain':
          setBackgroundImage('./src/assets/images/rainny.jpeg');
          break;
        case 'Snow':
          setBackgroundImage('./src/assets/images/snow.jpeg');
          break;
        case 'Clear':
          setBackgroundImage('./src/assets/images/sunny.jpeg');
          break;
        case 'Clouds':
          setBackgroundImage('./src/assets/images/cloudy.jpeg');
          break;
        default:
          setBackgroundImage(null);
          break;
      }
    }
  }, [data.weather]);

  return (
    <div
      className="app"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="search">
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={searchLocation}
          placeholder="Enter Location"
        ></input>
      </div>
      <div className="container flex max-w-[25%] space-x-8 space-y-4 rounded-lg bg-gray-800 bg-opacity-40">
        <div className="top">
          <div className="location">
            <p className="font-semibold text-white">{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? (
              <h1 className="text-6xl font-bold text-white">
                {(data.main.temp - 273.15).toFixed(0)}
                ºC
              </h1>
            ) : null}
          </div>
          <div className="description">
            <div>
              {data.weather ? (
                <p className="font-semibold text-white">
                  {data.weather[0].main}
                </p>
              ) : null}
            </div>
            <div>
              {data.rain?.['1h'] ? (
                <p className="font-semibold text-white">
                  {data.rain['1h']}mm (1h)
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="feels">
            {data.main ? (
              <p className="font-semibold text-white">
                Sensação térmica:&nbsp;
                {(data.main.feels_like - 273).toFixed(0)}ºC
              </p>
            ) : null}
          </div>
          <div className="humidity">
            {data.main ? (
              <p className="font-semibold text-white">
                Umidade: {data.main.humidity}%
              </p>
            ) : null}
          </div>
          <div className="wind">
            {data.wind ? (
              <h4 className="font-semibold text-white">
                Velocidade do vento:&nbsp;
                {(data.wind.speed * 3.6).toFixed(0)} km/h
              </h4>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
