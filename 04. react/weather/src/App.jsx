import logo from './logo.svg';
import './App.css';

import { useState, useEffect } from "react";
import axios from "axios";



function RedditPost() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {

    axios.get(`https://www.reddit.com/r/reactjs.json`)
      .then(res => {
        const newPosts = res.data.data.children
          .map(obj => obj.data);

        setPosts(newPosts);
      });

  }, [])

  return (
    <div>
      {/* <h6> {posts[0]?.title}</h6>
      <h6> {posts[1]?.title}</h6>
      <h6> {posts[2]?.title}</h6>
      <h6> {posts[3]?.title}</h6>
      <h6> {posts[4]?.title}</h6> */}

      {posts.map((eachpost, postIndex) => {
        return <div>

          <h3 key={postIndex}>
            {eachpost.title}
          </h3>
          <p>
            {eachpost.selftext}
          </p>

          {(eachpost.thumbnail !== "self") ?
            <img src={eachpost.thumbnail} alt="thumbnail" />
            :
            null
          }
        </div>
      })}

    </div>
  );

}


function Weather() {

  const [weather, setWeather] = useState({});
  const [city, setCity] = useState("");

  useEffect(() => {
    
    axios.get(`https://api.weatherapi.com/v1/current.json?key=5f50d76cd06943d099f160402221902&q=${"karachi"}&aqi=no`)
      .then(res => { setWeather(res.data); });

  }, []);

  function getWeather(e) {
    e.preventDefault();
    axios.get(`https://api.weatherapi.com/v1/current.json?key=5f50d76cd06943d099f160402221902&q=${city}&aqi=no`)
      .then(res => { setWeather(res.data); });
  }

  return (
    <div>

      <form onSubmit={getWeather}>
        <input type="text" onChange={(e) => { setCity(e.target.value) }} />
        <button type="submit">Get Weather</button>
      </form>

      {weather.current ? (
        <>
          <h1>Weather of {weather?.location?.name}</h1>
          <h2>
            {weather.current.temp_c}°C (feels like: {weather.current.feelslike_c}°C)
          </h2>
          <h2>humidity: {weather?.current?.humidity}</h2>

          <h2>Wind speed: {weather?.current?.wind_kph} Km/h </h2>
          <h2>wind coming from: {weather?.current?.wind_dir}</h2>
        </>
      ) : <h1>Loading...</h1>}
    </div>
  )

}



function App() {
  return <Weather />;
}
export default App;
