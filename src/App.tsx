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
      <div className="search flex justify-between py-3 px-6">
        <div className="relative flex items-center text-gray-400 focus-within:text-gray-600">
          <svg
            className="pointer-events-none absolute ml-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m19.6 21l-6.3-6.3q-.75.6-1.725.95Q10.6 16 9.5 16q-2.725 0-4.612-1.887Q3 12.225 3 9.5q0-2.725 1.888-4.613Q6.775 3 9.5 3t4.613 1.887Q16 6.775 16 9.5q0 1.1-.35 2.075q-.35.975-.95 1.725l6.3 6.3ZM9.5 14q1.875 0 3.188-1.312Q14 11.375 14 9.5q0-1.875-1.312-3.188Q11.375 5 9.5 5Q7.625 5 6.312 6.312Q5 7.625 5 9.5q0 1.875 1.312 3.188Q7.625 14 9.5 14Z"
            />
          </svg>
          <input
            className="rounded-2xl py-2 pr-3 pl-10 font-semibold text-black placeholder-gray-500 opacity-50 ring-2 ring-gray-300 focus:ring-2 focus:ring-gray-500"
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyDown={searchLocation}
            placeholder="Enter Location"
          ></input>
        </div>
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
