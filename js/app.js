const API_KEY = '5be42b8dd76947a58a575450251203';
const API_URL = 'https://api.weatherapi.com/v1/current.json';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const weatherContainer = document.getElementById('weather-container');

const getWeather = debounce(async () => {
    const city = searchInput.value.trim();
    if (!city) return;
    
    weatherContainer.innerHTML = `
        <div class="text-center text-white opacity-70">
            Fetching weather data...
        </div>
    `;
    
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}&q=${city}&aqi=no`);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherContainer.innerHTML = `
            <div class="text-red-300">
                ${error.message || 'Unable to fetch weather data'}
            </div>
        `;
    }
}, 500);

function displayWeather(data) {
    const { location, current } = data;
    const date = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const condition = current.condition.text.toLowerCase();
    const backgroundClass = Object.keys(weatherBackgrounds).find(key => 
        condition.includes(key)
    ) || 'default';
    
    document.body.className = `bg-gradient-to-br ${weatherBackgrounds[backgroundClass]} min-h-screen flex items-center justify-center`;
    
    weatherContainer.innerHTML = `
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-2">${location.name}, ${location.country}</h2>
            <p class="text-sm mb-4 opacity-80">${date}</p>
            
            <div class="weather-icon mx-auto w-32 h-32 mb-4">
                <img src="${current.condition.icon}" alt="${current.condition.text}" class="w-full h-full object-contain">
            </div>
            
            <div class="temperature text-6xl font-extrabold mb-4">
                ${Math.round(current.temp_c)}°C
            </div>
            
            <p class="text-xl mb-6 capitalize">${current.condition.text}</p>
            
            <div class="grid grid-cols-3 gap-4">
                <div class="detail-item">
                    <p class="text-xs opacity-70">Feels Like</p>
                    <p class="font-bold">${Math.round(current.feelslike_c)}°C</p>
                </div>
                <div class="detail-item">
                    <p class="text-xs opacity-70">Humidity</p>
                    <p class="font-bold">${current.humidity}%</p>
                </div>
                <div class="detail-item">
                    <p class="text-xs opacity-70">Wind</p>
                    <p class="font-bold">${current.wind_kph} km/h</p>
                </div>
            </div>
        </div>
    `;
}

searchButton.addEventListener('click', getWeather);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});