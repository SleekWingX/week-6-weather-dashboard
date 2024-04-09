const apiKey = '663406d2883622d0303f3f3f3f3f495f';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

const citySearchEl = document.querySelector("#city-search");
const cityResultEl = document.querySelector('#city-info');
const forecastResultEl = document.querySelector('#forecast-container');
const cityEl = document.querySelector('#result-city');
const cityListEl = document.querySelector('#city-list');

function fetchWeather(city) {
    return fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            return null;
        });
}

function createWeatherDashboard(weather) {
    const date = new Date(weather.dt * 1000);
    const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;

    const cardState = document.createElement("div");
    cardState.classList.add("card-state");
    cardState.textContent = weather.name;

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header", "h4");
    cardHeader.textContent = date;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardIcon = document.createElement("img");
    cardIcon.src = iconUrl;
    cardIcon.classList.add("card-icon");

    const cardTemp = document.createElement("p");
    cardTemp.classList.add("card-text");
    cardTemp.textContent = `Temperature: ${weather.main.temp} °C`;

    const cardWind = document.createElement("p");
    cardWind.classList.add("card-text");
    cardWind.textContent = `Wind Speed: ${weather.wind.speed} m/s`;

    const cardHumidity = document.createElement("p");
    cardHumidity.classList.add("card-text");
    cardHumidity.textContent = `Humidity: ${weather.main.humidity}%`;

    cardBody.append(cardTemp, cardIcon, cardWind, cardHumidity);

    cityResultEl.innerHTML = ''; // Clear previous content
    cityResultEl.appendChild(cardState);
    cityResultEl.appendChild(cardHeader);
    cityResultEl.appendChild(cardBody);
    
    // Save the searched city to local storage
    saveCityToLocalStorage(weather.name);
    // Update the city list
    updateCityList();
}

function fetchForecast(city) {
    return fetch(`${forecastApiUrl}?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            return null;
        });
}

function createForecastCards(forecastData) {
    forecastResultEl.innerHTML = ''; // Clear previous content

    for (let i = 0; i < forecastData.list.length; i += 8) {
        const forecast = forecastData.list[i];
        const date = new Date(forecast.dt * 1000);
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
        const temperature = forecast.main.temp;

        const card = document.createElement('div');
        card.classList.add('forecast-card'); // Add forecast card class

        const cardDate = document.createElement('p');
        cardDate.textContent = date.toDateString();

        const cardIcon = document.createElement('img');
        cardIcon.src = iconUrl;

        const cardTemp = document.createElement('p');
        cardTemp.textContent = `Temperature: ${temperature} °C`;

        card.appendChild(cardDate);
        card.appendChild(cardIcon);
        card.appendChild(cardTemp);

        forecastResultEl.appendChild(card);
    }
}

document.getElementById("submit-button").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission
    handleSearchAndDisplay();
});

function handleSearchAndDisplay(cityName) {
    const cityInput = cityName || citySearchEl.value.trim(); // Use provided cityName or input value from search bar
    if (cityInput !== '') {
        fetchWeather(cityInput)
            .then(data => {
                if (data) {
                    console.log('Weather data:', data);
                    createWeatherDashboard(data);
                } else {
                    console.log('Weather data not available.');
                }
            });

        fetchForecast(cityInput)
            .then(data => {
                if (data) {
                    console.log('Forecast data:', data);
                    createForecastCards(data);
                } else {
                    console.log('Forecast data not available.');
                }
            });
    } else {
        alert('Please enter a city name.');
    }

    // Clear the search bar after hitting submit
    citySearchEl.value = '';
}

function saveCityToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
}

function updateCityList() {
    cityListEl.innerHTML = ''; // Clear previous content
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    const uniqueCities = new Set(cities); // Convert the array to a Set to remove duplicates
    uniqueCities.forEach(city => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', function() {
            handleSearchAndDisplay(city); // Pass the city name to the function
        });
        li.appendChild(button);
        cityListEl.appendChild(li);
    });
}

window.onbeforeunload = function() {
    localStorage.removeItem('cities');
};

/* https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey} */