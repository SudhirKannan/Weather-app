console.log("Created by Sudhir");

// Select DOM elements for interaction and display
const input = document.querySelector('#input');
const button = document.querySelector('#button');
const output = document.querySelector('#output-container');
const currentDiv = document.querySelector('#current-div');
const forecastDiv = document.querySelector('#forecast-div');
const inputContainer = document.querySelector('#input-container');
const title = document.querySelector('.display-2');
const tagline = document.querySelector('#tagline');

// OpenWeatherMap API Key
const API_KEY = '7054e9df9b4f86f9c2e31dea430445e2';

/**
 * Utility function to delay execution (used for smooth UI transitions)
 * @param {number} ms - milliseconds to delay
 */
function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

/**
 * Main function to fetch and display weather data and forecast
 */
async function getWeather() {
    // Reset previous weather display and animate the input area
    currentDiv.innerHTML = '';
    forecastDiv.innerHTML = '';
    inputContainer.classList.add('up');
    title.classList.add('up');
    tagline.classList.add('up');
    output.classList.remove('visible');
    currentDiv.classList.remove('visible');
    forecastDiv.classList.remove('visible');

    // Get and validate city name from input
    const city = input.value.trim();
    if (!city) {
        alert("City name can't be empty, Enter a valid City name");
        input.value = '';
        return;
    }

    try {
        // ------------------ Fetch Current Weather Data ------------------
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        // Extract relevant weather info
        const { temp, humidity } = data.main;
        const { description, icon } = data.weather[0];
        const { lat, lon } = data.coord;

        // Populate the current weather section
        currentDiv.innerHTML = `
            <h3>${city.toUpperCase()}</h3>
            <h5>Current Weather Data</h5>
            <hr>
            <h4>Temperature: <strong>${temp}</strong>°C</h4>
            <p>Humidity: ${humidity}%</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
            <p>${description}</p>
        `;
        currentDiv.classList.add('card-color');

        // ------------------ Fetch 5 Upcoming Forecasts ------------------
        const res2 = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data2 = await res2.json();
        if (!res2.ok) throw new Error(data2.message);

        // Clear previous forecast cards
        forecastDiv.innerHTML = '';

        // Display forecast for the next 5 time intervals
        data2.list.slice(0, 5).forEach((item) => {
            const time = new Date(item.dt * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            });
            const temp = Math.round(item.main.temp);
            const { icon, description } = item.weather[0];

            // Create forecast card
            const card = document.createElement('div');
            card.className = 'forecast-card p-2 text-center card-color';
            card.innerHTML = `
                <p><strong>${time}</strong></p>
                <hr>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
                <p><i class="bi bi-thermometer-half"></i> ${temp}°C</p>
                <p><i class="bi bi-cloud-sun"></i> ${description}</p>
            `;
            forecastDiv.appendChild(card);
        });

        // Reset input and apply container style
        input.value = '';
        output.classList.add('cont-color');

        // ------------------ Animate Weather Result Visibility ------------------
        await delay(100);
        output.classList.add('visible');

        await delay(300);
        currentDiv.classList.add('visible');

        await delay(300);
        forecastDiv.classList.add('visible');

        // Remove animation class after everything is shown
        await delay(300);
        title.classList.remove('up');
        tagline.classList.remove('up');
        inputContainer.classList.remove('up');

    } catch (error) {
        // Handle invalid city or API errors
        alert('City Not Found, Enter a valid City Name');
        console.log('Error :',error)
        input.value = '';
    }
}

// ------------------ Event Listeners ------------------

// Fetch weather on button click
button.addEventListener('click', getWeather);

// Also fetch weather if user presses Enter key inside the input box
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        getWeather();
    }
});
