async function getWeatherData(city, state) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${state}&units=metric&appid=${myAPI}`
    );
    const data = await response.json();
    return data;
  }
  
  function displayWeatherData(data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { sunrise, sunset } = data.sys;
    const currentTime = Date.now() / 1000;

    const fahrenheit = (temp * 9) / 5 + 32; // convert Celsius to Fahrenheit
  
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".temp").innerText = fahrenheit.toFixed(1) + "°F";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  
    let backgroundImageUrl;
    const isDayTime = currentTime > sunrise && currentTime < sunset;
  
    // Set background image based on weather conditions and time of day
    switch (data.weather[0].main) {
      case "Clear":
        backgroundImageUrl = isDayTime
          ? "url('./static/images/background/clearSKYday.png')"
          : "url('./static/images/background/clearSKYnight.png')";
        break;
      case "Clouds":
        backgroundImageUrl = isDayTime
          ? "url('./static/images/background/cloudsDAY.jpg')"
          : (Math.random() > 0.5 ? "url('./static/images/background/cloudsNIGHT.jpg')" : "url('./static/images/background/cloudsNIGHT2.jpg')");
        break;
      case "Rain":
      case "Drizzle":
        backgroundImageUrl = isDayTime
          ? "url('./static/images/background/rainDAY.jpg')"
          : "url('./static/images/background/rainNIGHT.jpg')";
        break;
      case "Thunderstorm":
        backgroundImageUrl = isDayTime
          ? "url('./static/images/background/thunderstormDAY.jpg')"
          : "url('./static/images/background/thunderstormNIGHT.jpg')";
        break;
      case "Snow":
        backgroundImageUrl = isDayTime
          ? "url('./static/images/background/snowDAY.png')"
          : "url('./static/images/background/snowNIGHT.png')";
        break;
      default:
        backgroundImageUrl = isDayTime
          ? "url('./static/images/background/weatherday.png')"
          : "url('./static/images/background/weathernight.png')";
        break;
    }
  
    document.body.style.backgroundImage = backgroundImageUrl;
  }

  function handlePositionError() {
    alert(
      "There was an error getting your location, try refreshing the page and try again."
    );
  }
  
  async function getPositionAndWeather() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      const data = await getWeatherDataByCoords(latitude, longitude);
      displayWeatherData(data);
    } catch (error) {
      handlePositionError();
    }
  }
  
  async function getWeatherDataByCoords(latitude, longitude) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${myAPI}&units=metric`);
    const data = await response.json();
    return data;
  }
  
  document.querySelector(".search button").addEventListener("click", async () => {
    const city = document.querySelector(".search-bar-city").value;
    const state = document.querySelector(".search-bar-state").value;
    const data = await getWeatherData(city, state);
    displayWeatherData(data);
  });
  
  document.querySelector(".search-bar-state").addEventListener("keyup", async (event) => {
    if (event.key == "Enter") {
      const city = document.querySelector(".search-bar-city").value;
      const state = document.querySelector(".search-bar-state").value;
      const data = await getWeatherData(city, state);
      displayWeatherData(data);
    }
  });
  
  getPositionAndWeather();