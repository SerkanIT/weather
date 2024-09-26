const apiKey = "795ec4ea2a69dd089294286c9b8bc929"; 

function getCityWeather() {
  const cityName = document.getElementById("cityInput").value;
  const messageBox = document.getElementById("message");

  if (!cityName) {
    displayMessage("Please enter a city name", "error");
    return;
  }

  localStorage.setItem("lastCity", cityName);

  const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

  fetch(geocodeUrl)
    .then((response) => response.json())
    .then((geoData) => {
      if (geoData.length === 0) {
        displayMessage("City not found", "error");

        setTimeout(() => {
          clearInputAndHideMessage();
        }, 2000);

        return;
      }

      const lat = geoData[0].lat;
      const lon = geoData[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      fetch(weatherUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setTimeout(() => {
            displayWeatherData(data);
            displayMessage("", "clear"); 

            setTimeout(() => {
              clearInputAndHideMessage();
            }, 5000); 
          }, 2000); 
        })
        .catch((error) => {
          console.error("Error:", error);
          displayMessage("Error fetching weather data", "error");
        });
    })
    .catch((error) => {
      console.error("Geocoding error:", error);
      displayMessage("Geocoding error", "error");
    });
}

function displayWeatherData(data) {
  const city = data.name;
  const temperature = data.main.temp;
  const weather = data.weather[0].description;

  document.getElementById("weather").innerHTML = `
    <h2>${city}</h2>
    <p>Temperature: ${temperature}°C</p>
    <p>Condition: ${weather}</p>
  `;
}

function displayMessage(message, type) {
  const messageBox = document.getElementById("message");
  if (type === "clear") {
    messageBox.innerHTML = "";
    messageBox.style.display = "none";
    return;
  }

  const messageTypeClass = type === "error" ? "error-message" : "info-message";
  messageBox.innerHTML = `<p class="${messageTypeClass}">${message}</p>`;
  messageBox.style.display = "block";
}

function clearInputAndHideMessage() {
  document.getElementById("cityInput").value = ""; 
  displayMessage("", "clear");
}

function loadLastCityWeather() {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    document.getElementById("cityInput").value = lastCity;
    getCityWeather();
  }
}

window.onload = loadLastCityWeather;
