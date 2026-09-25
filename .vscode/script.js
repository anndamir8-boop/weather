<<<<<<< HEAD
let API_KEY = "66c93b68b8095f2e241cd17ca83e4f40";
let USE_MOCK = false; // set from /config.json to force local mock files
const defaultCity = "Accra";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherCard = document.getElementById("weather-card");
const errorMessage = document.getElementById("error-message");
const forecastContainer = document.getElementById("forecast-container");
const subcitySelect = document.getElementById("subcity-select");
const subcityRefreshBtn = document.getElementById("subcity-refresh-btn");
const subcityForecastContainer = document.getElementById("subcity-forecast");
const subcityMessage = document.getElementById("subcity-message");
const settingsToggle = document.getElementById("settings-toggle");
const settingsPanel = document.getElementById("settings-panel");
const settingsClose = document.getElementById("settings-close");
const homeBtn = document.getElementById("home-btn");
const headerSearchBtn = document.getElementById("header-search-btn");
const notificationBtn = document.getElementById("notification-btn");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const themeButtons = document.querySelectorAll("[data-theme]");
const styleButtons = document.querySelectorAll("[data-style]");
const fontButtons = document.querySelectorAll("[data-font]");
const skyButtons = document.querySelectorAll("[data-sky]");
const signInBtn = document.getElementById("sign-in-btn");
const signOutBtn = document.getElementById("sign-out-btn");
const authStatus = document.getElementById("auth-status");
const bodyElement = document.body;

let userSignedIn = false;
let manualSkyTheme = null; // Track if user manually selected a sky theme

const cityName = document.getElementById("city-name");
const dateElement = document.getElementById("date");
const descriptionElement = document.getElementById("description");
const temperatureElement = document.getElementById("temperature");
const weatherIcon = document.getElementById("weather-icon");
const feelsLikeElement = document.getElementById("feels-like");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");

// Advanced Meteorological Feature Elements
const relHumidityElement = document.getElementById("rel-humidity");
const pressureElement = document.getElementById("pressure");
const windSpeedElement = document.getElementById("wind-speed");
const windDirectionElement = document.getElementById("wind-direction");
const precipitationElement = document.getElementById("precipitation");
const visibilityElement = document.getElementById("visibility");
const dewPointElement = document.getElementById("dew-point");
const geopotentialHeightElement = document.getElementById("geopotential-height");
const precipitableWaterElement = document.getElementById("precipitable-water");
const cloudCoverElement = document.getElementById("cloud-cover");
const solarRadiationElement = document.getElementById("solar-radiation");
const capeElement = document.getElementById("cape");
const seaSurfaceTempElement = document.getElementById("sea-surface-temp");
const uvIndexElement = document.getElementById("uv-index");
const localTimeElement = document.getElementById("local-time");
const sunriseSunsetElement = document.getElementById("sunrise-sunset");
const topographyElement = document.getElementById("topography");
const timezoneElement = document.getElementById("timezone");

const accraSubCities = [
  { key: "east-legon", name: "East Legon" },
  { key: "okponglo", name: "Okponglo" },
  { key: "spanner", name: "Spanner" },
  { key: "spintex", name: "Spintex" },
  { key: "haatso", name: "Haatso" }
];

const accraSubCityForecasts = {
  "east-legon": { city: { name: "East Legon" }, list: [] },
  "okponglo": { city: { name: "Okponglo" }, list: [] },
  "spanner": { city: { name: "Spanner" }, list: [] },
  "spintex": { city: { name: "Spintex" }, list: [] },
  "haatso": { city: { name: "Haatso" }, list: [] }
};

let accraForecastData = null;

function populateSubcitySelect() {
  subcitySelect.innerHTML = "<option value=''>Select an Accra district</option>";

  if (accraSubCities.length === 0) {
    subcitySelect.disabled = true;
    subcityRefreshBtn.disabled = true;
    subcityMessage.textContent = "No sub-city forecast data available yet. Provide an Accra sub-city list to enable this feature.";
    subcityForecastContainer.innerHTML = "";
    return;
  }

  accraSubCities.forEach((subcity) => {
    const option = document.createElement("option");
    option.value = subcity.key;
    option.textContent = subcity.name;
    subcitySelect.appendChild(option);
  });

  subcitySelect.disabled = false;
  subcityRefreshBtn.disabled = false;
  subcityMessage.textContent = "Choose a district to view its forecast.";
}

function createSubcityForecastCard(item) {
  const card = document.createElement("div");
  card.className = "forecast-item";

  const day = new Date(item.dt * 1000).toLocaleDateString("en", {
    weekday: "short"
  });

  card.innerHTML = `
    <p><strong>${day}</strong></p>
    <img src="https://openweathermap.org/img/wn/${(item.weather && item.weather[0] && item.weather[0].icon) || '04d'}@2x.png" alt="${(item.weather && item.weather[0] && item.weather[0].description) || ''}" />
    <p>${Math.round(getItemTemp(item) ?? 0)}°C</p>
    <small>${(item.weather && item.weather[0] && item.weather[0].description) || 'No data'}</small>
  `;

  return card;
}

function renderSubcityForecast(subcityKey) {
  if (!subcityKey || !accraSubCityForecasts[subcityKey]) {
    subcityMessage.textContent = "Select a district once sub-city forecast data is available.";
    subcityForecastContainer.innerHTML = "";
    return;
  }

  const forecast = accraSubCityForecasts[subcityKey];
  subcityForecastContainer.innerHTML = "";

  if (!forecast.list || forecast.list.length === 0) {
    subcityMessage.textContent = "This district currently has no forecast data.";
    return;
  }

  forecast.list.slice(0, 5).forEach((item) => {
    subcityForecastContainer.appendChild(createSubcityForecastCard(item));
  });

  subcityMessage.textContent = `Showing forecast for ${forecast.city.name} district.`;
}

function refreshSubcityForecast() {
  const selected = subcitySelect.value;
  renderSubcityForecast(selected);
}

function initializeSubcitySection() {
  populateSubcitySelect();
  subcitySelect.addEventListener("change", refreshSubcityForecast);
  subcityRefreshBtn.addEventListener("click", refreshSubcityForecast);
}

function toggleSettingsPanel(show) {
  settingsPanel.classList.toggle("hidden", !show);
}

function applyTheme(theme) {
  bodyElement.classList.toggle("dark-theme", theme === "dark");
  const moonIcon = darkModeToggle.querySelector("i");
  if (theme === "dark") {
    moonIcon.className = "fas fa-sun";
    darkModeToggle.setAttribute("aria-label", "Disable dark mode");
  } else {
    moonIcon.className = "fas fa-moon";
    darkModeToggle.setAttribute("aria-label", "Enable dark mode");
  }
}

function applyStyle(styleName) {
  bodyElement.classList.toggle("modern-style", styleName === "modern");
}

function applyFont(fontName) {
  bodyElement.classList.remove("font-system", "font-serif", "font-mono");
  bodyElement.classList.add(`font-${fontName}`);
}

function updateAuthStatus() {
  authStatus.textContent = userSignedIn ? "Signed in as Ahmedsule" : "Signed out";
  signInBtn.disabled = userSignedIn;
  signOutBtn.disabled = !userSignedIn;
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}

function hideError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function createForecastCard(item) {
  const card = document.createElement("div");
  card.className = "forecast-item";

  const day = item.dayName || new Date(item.dt * 1000).toLocaleDateString("en", {
    weekday: "short"
  });

  if (!item.weather || !item.weather[0]) {
    card.innerHTML = `
      <p><strong>${day}</strong></p>
      <p>No data</p>
    `;
    return card;
  }

  card.innerHTML = `
    <p><strong>${day}</strong></p>
    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}" />
    <p>${Math.round(getItemTemp(item) ?? 0)}°C</p>
    <small>${item.weather[0].description}</small>
  `;

  return card;
}

function getItemTemp(item) {
  // Support both OpenWeather 'main.temp' and some mock schemas with 'temp.day' or 'temp'
  if (!item) return null;
  if (item.main && typeof item.main.temp === 'number') return item.main.temp;
  if (item.temp && typeof item.temp.day === 'number') return item.temp.day;
  if (item.temp && typeof item.temp === 'number') return item.temp;
  return null;
}

function normalizeTemperature(t) {
  if (t === null || typeof t !== 'number') return null;
  // if value looks like Kelvin, convert to Celsius
  if (t > 200) return t - 273.15;
  return t;
}

// Calculate Dew Point using Magnus formula
function calculateDewPoint(temp, humidity) {
  if (temp === null || humidity === null) return null;
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha);
}

// Convert wind degree to direction
function getWindDirection(degree) {
  if (degree === null || degree === undefined) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index] + ' (' + degree + '°)';
}

// Format visibility in km
function formatVisibility(visibility) {
  if (!visibility) return 'N/A';
  return (visibility / 1000).toFixed(1) + ' km';
}

// Estimate Solar Radiation (simplified - requires more data for accuracy)
function estimateSolarRadiation(cloudCover, hour) {
  if (!cloudCover && hour === undefined) return 'N/A';
  const maxRadiation = 1000; // W/m² max
  const cloudEffect = (100 - (cloudCover || 0)) / 100;
  const hourEffect = Math.max(0, Math.sin((hour || 12) * Math.PI / 24));
  return Math.round(maxRadiation * cloudEffect * hourEffect) + ' W/m²';
}

// Format time with timezone
function formatLocalTime(timestamp, timezone) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { timeZone: 'Africa/Accra' });
}

// Format sunrise and sunset
function formatSunriseSunset(sunrise, sunset) {
  if (!sunrise || !sunset) return 'N/A';
  const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return `↑ ${sunriseTime} | ↓ ${sunsetTime}`;
}

// Estimate CAPE (requires more detailed data - simplified version)
function estimateCAPA(temp, humidity, pressure) {
  if (!temp || !humidity || !pressure) return 'N/A';
  // Simplified CAPE calculation - full CAPE requires atmospheric profile
  const dewPoint = calculateDewPoint(temp, humidity);
  const instability = (temp - dewPoint) * humidity / 100;
  return Math.round(Math.max(0, instability * 50)) + ' J/kg';
}

// Get total precipitable water (simplified estimation)
function estimatePrecipitableWater(humidity, temp, pressure) {
  if (!humidity || !temp || !pressure) return 'N/A';
  // Simplified TPW estimation
  const saturationMixingRatio = 0.622 * (6.112 * Math.exp((17.67 * temp) / (temp + 243.5))) / (pressure - 6.112 * Math.exp((17.67 * temp) / (temp + 243.5)));
  const mixingRatio = saturationMixingRatio * (humidity / 100);
  const tpw = mixingRatio * (pressure / 1013.25) * 2.5; // Rough conversion
  return Math.round(tpw) + ' mm';
}

function renderWeather(current, forecast) {
  cityName.textContent = `${current.name || ''}${current.sys && current.sys.country ? ', ' + current.sys.country : ''}`;
  dateElement.textContent = formatDate(current.dt || Math.floor(Date.now()/1000));
  descriptionElement.textContent = (current.weather && current.weather[0] && current.weather[0].description) || '';
  const tempRaw = getItemTemp(current) ?? (current.main && current.main.temp);
  const tempC = normalizeTemperature(tempRaw) ?? 0;
  temperatureElement.textContent = `${Math.round(tempC)}°C`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${(current.weather && current.weather[0] && current.weather[0].icon) || '04d'}@2x.png`;
  weatherIcon.alt = (current.weather && current.weather[0] && current.weather[0].description) || '';
  const feelsRaw = current.main && current.main.feels_like;
  feelsLikeElement.textContent = feelsRaw ? `Feels like ${Math.round(normalizeTemperature(feelsRaw))}°C` : '';
  humidityElement.textContent = current.main && current.main.humidity ? `Humidity ${current.main.humidity}%` : '';
  windElement.textContent = current.wind && current.wind.speed ? `Wind ${current.wind.speed} m/s` : '';

  // Populate Advanced Meteorological Features
  const humidity = current.main ? current.main.humidity : null;
  const pressure = current.main ? current.main.pressure : null;
  const windSpeed = current.wind ? current.wind.speed : null;
  const windDeg = current.wind ? current.wind.deg : null;
  const precipitation = (current.rain ? current.rain['1h'] : 0) || (current.snow ? current.snow['1h'] : 0) || 0;
  const visibility = current.visibility;
  const cloudCover = current.clouds ? current.clouds.all : null;

  // Meteorology Features
  relHumidityElement.textContent = humidity ? `${humidity}%` : 'N/A';
  pressureElement.textContent = pressure ? `${pressure} hPa` : 'N/A';
  windSpeedElement.textContent = windSpeed !== null ? `${windSpeed} m/s (${(windSpeed * 3.6).toFixed(1)} km/h)` : 'N/A';
  windDirectionElement.textContent = windDeg !== null ? getWindDirection(windDeg) : 'N/A';
  precipitationElement.textContent = precipitation ? `${precipitation.toFixed(2)} mm` : '0 mm';
  visibilityElement.textContent = formatVisibility(visibility);

  // Atmospheric Features
  const dewPoint = calculateDewPoint(tempC, humidity);
  dewPointElement.textContent = dewPoint !== null ? `${Math.round(dewPoint)}°C` : 'N/A';
  
  // Geopotential height (simplified - needs more detailed data)
  const estimatedHeight = pressure ? Math.round((101325 - pressure * 100) / 12) : 0;
  geopotentialHeightElement.textContent = pressure ? `~${estimatedHeight} m` : 'N/A';
  
  // Precipitable Water
  precipitableWaterElement.textContent = estimatePrecipitableWater(humidity, tempC, pressure);
  
  // Cloud Cover
  cloudCoverElement.textContent = cloudCover !== null ? `${cloudCover}%` : 'N/A';

  // Energy & Physics Features
  const hour = new Date(current.dt * 1000).getHours();
  solarRadiationElement.textContent = estimateSolarRadiation(cloudCover, hour);
  capeElement.textContent = estimateCAPA(tempC, humidity, pressure);
  
  // Sea Surface Temperature (usually N/A unless over ocean - placeholder)
  seaSurfaceTempElement.textContent = 'N/A (Land location)';
  
  // UV Index (can be added if using paid OpenWeather API)
  uvIndexElement.textContent = 'N/A (Requires UV API)';

  // Time & Space Features
  localTimeElement.textContent = formatLocalTime(current.dt, current.timezone);
  sunriseSunsetElement.textContent = formatSunriseSunset(current.sys?.sunrise, current.sys?.sunset);
  topographyElement.textContent = current.name ? `Accra, Ghana (~0 m)` : 'N/A';
  timezoneElement.textContent = current.timezone ? `UTC ${(current.timezone / 3600).toString().replace(/^(-?\d+)$/, '$&')}` : 'UTC+0';

  // Keep the original app background color on startup.
  bodyElement.classList.remove('day-mode', 'night-mode');

  forecastContainer.innerHTML = "";
  
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const forecastByDay = daysOfWeek.map((dayName) => {
    const forecastItem = forecast.list.find((item) => {
      const index = (new Date(item.dt * 1000).getDay() + 6) % 7;
      return daysOfWeek[index] === dayName;
    });
    return forecastItem ? { ...forecastItem, dayName } : { dayName };
  });

  forecastByDay.forEach((item) => {
    forecastContainer.appendChild(createForecastCard(item));
  });

  hideError();
  weatherCard.classList.remove("hidden");
}

async function loadWeather(city) {
  const cityNameValue = (city && city.trim && city.trim()) || defaultCity;

  try {
    let currentResponse, forecastResponse;
    if (USE_MOCK) {
      currentResponse = await fetch('/mock/weather.json');
      forecastResponse = await fetch('/mock/forecast.json');
    } else {
      currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityNameValue)}&appid=${API_KEY}&units=metric`);
      forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityNameValue)}&appid=${API_KEY}&units=metric`);
    }

    const current = await currentResponse.json().catch(() => null);
    const forecast = await forecastResponse.json().catch(() => null);

    // check for HTTP errors or API error codes
    if (!currentResponse.ok || (current && (current.cod && Number(current.cod) !== 200))) {
      const msg = (current && current.message) || `Failed to fetch current weather (${currentResponse.status})`;
      throw new Error(msg);
    }
    if (!forecastResponse.ok || (forecast && (forecast.cod && Number(forecast.cod) !== 200 && String(forecast.cod) !== '200'))) {
      const msg = (forecast && forecast.message) || `Failed to fetch forecast (${forecastResponse.status})`;
      throw new Error(msg);
    }

    renderWeather(current, forecast);
  } catch (error) {
    showError(error.message || "Unable to fetch weather data right now.");
  }
}

searchBtn.addEventListener("click", () => {
  loadWeather(cityInput.value);
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadWeather(cityInput.value);
  }
});

settingsToggle.addEventListener("click", () => toggleSettingsPanel(true));
settingsClose.addEventListener("click", () => toggleSettingsPanel(false));
homeBtn.addEventListener("click", () => {
  loadWeather(defaultCity);
  toggleSettingsPanel(false);
});
headerSearchBtn.addEventListener("click", () => {
  loadWeather(defaultCity);
});
notificationBtn.addEventListener("click", () => {
  alert("No new notifications.");
});
darkModeToggle.addEventListener("click", () => {
  const isDark = bodyElement.classList.contains("dark-theme");
  applyTheme(isDark ? "light" : "dark");
});
themeButtons.forEach((button) => {
  button.addEventListener("click", () => applyTheme(button.dataset.theme));
});
styleButtons.forEach((button) => {
  button.addEventListener("click", () => applyStyle(button.dataset.style));
});
fontButtons.forEach((button) => {
  button.addEventListener("click", () => applyFont(button.dataset.font));
});
skyButtons.forEach((button) => {
  button.addEventListener("click", () => applyManualSkyTheme(button.dataset.sky));
});
signInBtn.addEventListener("click", () => {
  userSignedIn = true;
  updateAuthStatus();
});
signOutBtn.addEventListener("click", () => {
  userSignedIn = false;
  updateAuthStatus();
});

// Sky Background Management
function getSkyVibe() {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hour * 60 + minutes;

  // Determine time period
  // 5:00 - 6:30: Early Morning (Twilight)
  // 6:30 - 18:00: Daytime
  // 18:00 - 20:00: Sunset
  // 20:00 - 21:00: Twilight
  // 21:00 - 5:00: Starry Night / Deep Night

  if (hour >= 5 && hour < 6) return 'twilight-sky';
  if (hour >= 6 && hour < 18) return 'daytime-sky';
  if (hour >= 18 && hour < 20) return 'sunset-sky';
  if (hour >= 20 && hour < 21) return 'twilight-sky';
  if (hour >= 21 || hour < 5) return 'starry-night-sky';
  
  return 'daytime-sky';
}

function applyDynamicBackground() {
  // If user manually selected a sky theme, don't override it
  if (manualSkyTheme) return;
  
  const skyVibe = getSkyVibe();
  
  // Remove all sky classes
  bodyElement.classList.remove('daytime-sky', 'sunset-sky', 'twilight-sky', 'deepnight-sky', 'starry-night-sky');
  
  // Apply the appropriate sky class
  bodyElement.classList.add(skyVibe);
}

function applyManualSkyTheme(skyTheme) {
  manualSkyTheme = skyTheme;
  
  // Remove all sky classes
  bodyElement.classList.remove('daytime-sky', 'sunset-sky', 'twilight-sky', 'deepnight-sky', 'starry-night-sky');
  
  // Apply the selected sky theme
  bodyElement.classList.add(skyTheme);
}

// Update background every minute
setInterval(applyDynamicBackground, 60000);

async function initApp() {
  try {
    const res = await fetch('/config.json');
    if (res.ok) {
      const cfg = await res.json();
      if (cfg && cfg.OPENWEATHER_API_KEY) {
        API_KEY = cfg.OPENWEATHER_API_KEY;
      }
      if (cfg && (cfg.USE_MOCK === true || cfg.MOCK === true)) {
        USE_MOCK = true;
      }
    }
  } catch (e) {
    // no config file — proceed with existing API_KEY (placeholder)
  }

  initializeSubcitySection();
  updateAuthStatus();
  applyDynamicBackground(); // Apply sky background on init
  try { await loadWeather(defaultCity); } catch(e) { /* already handled */ }
}

initApp();
=======
let API_KEY = "66c93b68b8095f2e241cd17ca83e4f40";
let USE_MOCK = false; // set from /config.json to force local mock files
const defaultCity = "Accra";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherCard = document.getElementById("weather-card");
const errorMessage = document.getElementById("error-message");
const forecastContainer = document.getElementById("forecast-container");
const subcitySelect = document.getElementById("subcity-select");
const subcityRefreshBtn = document.getElementById("subcity-refresh-btn");
const subcityForecastContainer = document.getElementById("subcity-forecast");
const subcityMessage = document.getElementById("subcity-message");
const settingsToggle = document.getElementById("settings-toggle");
const settingsPanel = document.getElementById("settings-panel");
const settingsClose = document.getElementById("settings-close");
const homeBtn = document.getElementById("home-btn");
const headerSearchBtn = document.getElementById("header-search-btn");
const notificationBtn = document.getElementById("notification-btn");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const themeButtons = document.querySelectorAll("[data-theme]");
const styleButtons = document.querySelectorAll("[data-style]");
const fontButtons = document.querySelectorAll("[data-font]");
const skyButtons = document.querySelectorAll("[data-sky]");
const signInBtn = document.getElementById("sign-in-btn");
const signOutBtn = document.getElementById("sign-out-btn");
const authStatus = document.getElementById("auth-status");
const bodyElement = document.body;

let userSignedIn = false;
let manualSkyTheme = null; // Track if user manually selected a sky theme

const cityName = document.getElementById("city-name");
const dateElement = document.getElementById("date");
const descriptionElement = document.getElementById("description");
const temperatureElement = document.getElementById("temperature");
const weatherIcon = document.getElementById("weather-icon");
const feelsLikeElement = document.getElementById("feels-like");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");

// Advanced Meteorological Feature Elements
const relHumidityElement = document.getElementById("rel-humidity");
const pressureElement = document.getElementById("pressure");
const windSpeedElement = document.getElementById("wind-speed");
const windDirectionElement = document.getElementById("wind-direction");
const precipitationElement = document.getElementById("precipitation");
const visibilityElement = document.getElementById("visibility");
const dewPointElement = document.getElementById("dew-point");
const geopotentialHeightElement = document.getElementById("geopotential-height");
const precipitableWaterElement = document.getElementById("precipitable-water");
const cloudCoverElement = document.getElementById("cloud-cover");
const solarRadiationElement = document.getElementById("solar-radiation");
const capeElement = document.getElementById("cape");
const seaSurfaceTempElement = document.getElementById("sea-surface-temp");
const uvIndexElement = document.getElementById("uv-index");
const localTimeElement = document.getElementById("local-time");
const sunriseSunsetElement = document.getElementById("sunrise-sunset");
const topographyElement = document.getElementById("topography");
const timezoneElement = document.getElementById("timezone");

const accraSubCities = [
  { key: "east-legon", name: "East Legon" },
  { key: "okponglo", name: "Okponglo" },
  { key: "spanner", name: "Spanner" },
  { key: "spintex", name: "Spintex" },
  { key: "haatso", name: "Haatso" }
];

const accraSubCityForecasts = {
  "east-legon": { city: { name: "East Legon" }, list: [] },
  "okponglo": { city: { name: "Okponglo" }, list: [] },
  "spanner": { city: { name: "Spanner" }, list: [] },
  "spintex": { city: { name: "Spintex" }, list: [] },
  "haatso": { city: { name: "Haatso" }, list: [] }
};

let accraForecastData = null;

function populateSubcitySelect() {
  subcitySelect.innerHTML = "<option value=''>Select an Accra district</option>";

  if (accraSubCities.length === 0) {
    subcitySelect.disabled = true;
    subcityRefreshBtn.disabled = true;
    subcityMessage.textContent = "No sub-city forecast data available yet. Provide an Accra sub-city list to enable this feature.";
    subcityForecastContainer.innerHTML = "";
    return;
  }

  accraSubCities.forEach((subcity) => {
    const option = document.createElement("option");
    option.value = subcity.key;
    option.textContent = subcity.name;
    subcitySelect.appendChild(option);
  });

  subcitySelect.disabled = false;
  subcityRefreshBtn.disabled = false;
  subcityMessage.textContent = "Choose a district to view its forecast.";
}

function createSubcityForecastCard(item) {
  const card = document.createElement("div");
  card.className = "forecast-item";

  const day = new Date(item.dt * 1000).toLocaleDateString("en", {
    weekday: "short"
  });

  card.innerHTML = `
    <p><strong>${day}</strong></p>
    <img src="https://openweathermap.org/img/wn/${(item.weather && item.weather[0] && item.weather[0].icon) || '04d'}@2x.png" alt="${(item.weather && item.weather[0] && item.weather[0].description) || ''}" />
    <p>${Math.round(getItemTemp(item) ?? 0)}°C</p>
    <small>${(item.weather && item.weather[0] && item.weather[0].description) || 'No data'}</small>
  `;

  return card;
}

function renderSubcityForecast(subcityKey) {
  if (!subcityKey || !accraSubCityForecasts[subcityKey]) {
    subcityMessage.textContent = "Select a district once sub-city forecast data is available.";
    subcityForecastContainer.innerHTML = "";
    return;
  }

  const forecast = accraSubCityForecasts[subcityKey];
  subcityForecastContainer.innerHTML = "";

  if (!forecast.list || forecast.list.length === 0) {
    subcityMessage.textContent = "This district currently has no forecast data.";
    return;
  }

  forecast.list.slice(0, 5).forEach((item) => {
    subcityForecastContainer.appendChild(createSubcityForecastCard(item));
  });

  subcityMessage.textContent = `Showing forecast for ${forecast.city.name} district.`;
}

function refreshSubcityForecast() {
  const selected = subcitySelect.value;
  renderSubcityForecast(selected);
}

function initializeSubcitySection() {
  populateSubcitySelect();
  subcitySelect.addEventListener("change", refreshSubcityForecast);
  subcityRefreshBtn.addEventListener("click", refreshSubcityForecast);
}

function toggleSettingsPanel(show) {
  settingsPanel.classList.toggle("hidden", !show);
}

function applyTheme(theme) {
  bodyElement.classList.toggle("dark-theme", theme === "dark");
  const moonIcon = darkModeToggle.querySelector("i");
  if (theme === "dark") {
    moonIcon.className = "fas fa-sun";
    darkModeToggle.setAttribute("aria-label", "Disable dark mode");
  } else {
    moonIcon.className = "fas fa-moon";
    darkModeToggle.setAttribute("aria-label", "Enable dark mode");
  }
}

function applyStyle(styleName) {
  bodyElement.classList.toggle("modern-style", styleName === "modern");
}

function applyFont(fontName) {
  bodyElement.classList.remove("font-system", "font-serif", "font-mono");
  bodyElement.classList.add(`font-${fontName}`);
}

function updateAuthStatus() {
  authStatus.textContent = userSignedIn ? "Signed in as Ahmedsule" : "Signed out";
  signInBtn.disabled = userSignedIn;
  signOutBtn.disabled = !userSignedIn;
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}

function hideError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function createForecastCard(item) {
  const card = document.createElement("div");
  card.className = "forecast-item";

  const day = item.dayName || new Date(item.dt * 1000).toLocaleDateString("en", {
    weekday: "short"
  });

  if (!item.weather || !item.weather[0]) {
    card.innerHTML = `
      <p><strong>${day}</strong></p>
      <p>No data</p>
    `;
    return card;
  }

  card.innerHTML = `
    <p><strong>${day}</strong></p>
    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}" />
    <p>${Math.round(getItemTemp(item) ?? 0)}°C</p>
    <small>${item.weather[0].description}</small>
  `;

  return card;
}

function getItemTemp(item) {
  // Support both OpenWeather 'main.temp' and some mock schemas with 'temp.day' or 'temp'
  if (!item) return null;
  if (item.main && typeof item.main.temp === 'number') return item.main.temp;
  if (item.temp && typeof item.temp.day === 'number') return item.temp.day;
  if (item.temp && typeof item.temp === 'number') return item.temp;
  return null;
}

function normalizeTemperature(t) {
  if (t === null || typeof t !== 'number') return null;
  // if value looks like Kelvin, convert to Celsius
  if (t > 200) return t - 273.15;
  return t;
}

// Calculate Dew Point using Magnus formula
function calculateDewPoint(temp, humidity) {
  if (temp === null || humidity === null) return null;
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha);
}

// Convert wind degree to direction
function getWindDirection(degree) {
  if (degree === null || degree === undefined) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index] + ' (' + degree + '°)';
}

// Format visibility in km
function formatVisibility(visibility) {
  if (!visibility) return 'N/A';
  return (visibility / 1000).toFixed(1) + ' km';
}

// Estimate Solar Radiation (simplified - requires more data for accuracy)
function estimateSolarRadiation(cloudCover, hour) {
  if (!cloudCover && hour === undefined) return 'N/A';
  const maxRadiation = 1000; // W/m² max
  const cloudEffect = (100 - (cloudCover || 0)) / 100;
  const hourEffect = Math.max(0, Math.sin((hour || 12) * Math.PI / 24));
  return Math.round(maxRadiation * cloudEffect * hourEffect) + ' W/m²';
}

// Format time with timezone
function formatLocalTime(timestamp, timezone) {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { timeZone: 'Africa/Accra' });
}

// Format sunrise and sunset
function formatSunriseSunset(sunrise, sunset) {
  if (!sunrise || !sunset) return 'N/A';
  const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return `↑ ${sunriseTime} | ↓ ${sunsetTime}`;
}

// Estimate CAPE (requires more detailed data - simplified version)
function estimateCAPA(temp, humidity, pressure) {
  if (!temp || !humidity || !pressure) return 'N/A';
  // Simplified CAPE calculation - full CAPE requires atmospheric profile
  const dewPoint = calculateDewPoint(temp, humidity);
  const instability = (temp - dewPoint) * humidity / 100;
  return Math.round(Math.max(0, instability * 50)) + ' J/kg';
}

// Get total precipitable water (simplified estimation)
function estimatePrecipitableWater(humidity, temp, pressure) {
  if (!humidity || !temp || !pressure) return 'N/A';
  // Simplified TPW estimation
  const saturationMixingRatio = 0.622 * (6.112 * Math.exp((17.67 * temp) / (temp + 243.5))) / (pressure - 6.112 * Math.exp((17.67 * temp) / (temp + 243.5)));
  const mixingRatio = saturationMixingRatio * (humidity / 100);
  const tpw = mixingRatio * (pressure / 1013.25) * 2.5; // Rough conversion
  return Math.round(tpw) + ' mm';
}

function renderWeather(current, forecast) {
  cityName.textContent = `${current.name || ''}${current.sys && current.sys.country ? ', ' + current.sys.country : ''}`;
  dateElement.textContent = formatDate(current.dt || Math.floor(Date.now()/1000));
  descriptionElement.textContent = (current.weather && current.weather[0] && current.weather[0].description) || '';
  const tempRaw = getItemTemp(current) ?? (current.main && current.main.temp);
  const tempC = normalizeTemperature(tempRaw) ?? 0;
  temperatureElement.textContent = `${Math.round(tempC)}°C`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${(current.weather && current.weather[0] && current.weather[0].icon) || '04d'}@2x.png`;
  weatherIcon.alt = (current.weather && current.weather[0] && current.weather[0].description) || '';
  const feelsRaw = current.main && current.main.feels_like;
  feelsLikeElement.textContent = feelsRaw ? `Feels like ${Math.round(normalizeTemperature(feelsRaw))}°C` : '';
  humidityElement.textContent = current.main && current.main.humidity ? `Humidity ${current.main.humidity}%` : '';
  windElement.textContent = current.wind && current.wind.speed ? `Wind ${current.wind.speed} m/s` : '';

  // Populate Advanced Meteorological Features
  const humidity = current.main ? current.main.humidity : null;
  const pressure = current.main ? current.main.pressure : null;
  const windSpeed = current.wind ? current.wind.speed : null;
  const windDeg = current.wind ? current.wind.deg : null;
  const precipitation = (current.rain ? current.rain['1h'] : 0) || (current.snow ? current.snow['1h'] : 0) || 0;
  const visibility = current.visibility;
  const cloudCover = current.clouds ? current.clouds.all : null;

  // Meteorology Features
  relHumidityElement.textContent = humidity ? `${humidity}%` : 'N/A';
  pressureElement.textContent = pressure ? `${pressure} hPa` : 'N/A';
  windSpeedElement.textContent = windSpeed !== null ? `${windSpeed} m/s (${(windSpeed * 3.6).toFixed(1)} km/h)` : 'N/A';
  windDirectionElement.textContent = windDeg !== null ? getWindDirection(windDeg) : 'N/A';
  precipitationElement.textContent = precipitation ? `${precipitation.toFixed(2)} mm` : '0 mm';
  visibilityElement.textContent = formatVisibility(visibility);

  // Atmospheric Features
  const dewPoint = calculateDewPoint(tempC, humidity);
  dewPointElement.textContent = dewPoint !== null ? `${Math.round(dewPoint)}°C` : 'N/A';
  
  // Geopotential height (simplified - needs more detailed data)
  const estimatedHeight = pressure ? Math.round((101325 - pressure * 100) / 12) : 0;
  geopotentialHeightElement.textContent = pressure ? `~${estimatedHeight} m` : 'N/A';
  
  // Precipitable Water
  precipitableWaterElement.textContent = estimatePrecipitableWater(humidity, tempC, pressure);
  
  // Cloud Cover
  cloudCoverElement.textContent = cloudCover !== null ? `${cloudCover}%` : 'N/A';

  // Energy & Physics Features
  const hour = new Date(current.dt * 1000).getHours();
  solarRadiationElement.textContent = estimateSolarRadiation(cloudCover, hour);
  capeElement.textContent = estimateCAPA(tempC, humidity, pressure);
  
  // Sea Surface Temperature (usually N/A unless over ocean - placeholder)
  seaSurfaceTempElement.textContent = 'N/A (Land location)';
  
  // UV Index (can be added if using paid OpenWeather API)
  uvIndexElement.textContent = 'N/A (Requires UV API)';

  // Time & Space Features
  localTimeElement.textContent = formatLocalTime(current.dt, current.timezone);
  sunriseSunsetElement.textContent = formatSunriseSunset(current.sys?.sunrise, current.sys?.sunset);
  topographyElement.textContent = current.name ? `Accra, Ghana (~0 m)` : 'N/A';
  timezoneElement.textContent = current.timezone ? `UTC ${(current.timezone / 3600).toString().replace(/^(-?\d+)$/, '$&')}` : 'UTC+0';

  // Keep the original app background color on startup.
  bodyElement.classList.remove('day-mode', 'night-mode');

  forecastContainer.innerHTML = "";
  
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const forecastByDay = daysOfWeek.map((dayName) => {
    const forecastItem = forecast.list.find((item) => {
      const index = (new Date(item.dt * 1000).getDay() + 6) % 7;
      return daysOfWeek[index] === dayName;
    });
    return forecastItem ? { ...forecastItem, dayName } : { dayName };
  });

  forecastByDay.forEach((item) => {
    forecastContainer.appendChild(createForecastCard(item));
  });

  hideError();
  weatherCard.classList.remove("hidden");
}

async function loadWeather(city) {
  const cityNameValue = (city && city.trim && city.trim()) || defaultCity;

  try {
    let currentResponse, forecastResponse;
    if (USE_MOCK) {
      currentResponse = await fetch('/mock/weather.json');
      forecastResponse = await fetch('/mock/forecast.json');
    } else {
      currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityNameValue)}&appid=${API_KEY}&units=metric`);
      forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityNameValue)}&appid=${API_KEY}&units=metric`);
    }

    const current = await currentResponse.json().catch(() => null);
    const forecast = await forecastResponse.json().catch(() => null);

    // check for HTTP errors or API error codes
    if (!currentResponse.ok || (current && (current.cod && Number(current.cod) !== 200))) {
      const msg = (current && current.message) || `Failed to fetch current weather (${currentResponse.status})`;
      throw new Error(msg);
    }
    if (!forecastResponse.ok || (forecast && (forecast.cod && Number(forecast.cod) !== 200 && String(forecast.cod) !== '200'))) {
      const msg = (forecast && forecast.message) || `Failed to fetch forecast (${forecastResponse.status})`;
      throw new Error(msg);
    }

    renderWeather(current, forecast);
  } catch (error) {
    showError(error.message || "Unable to fetch weather data right now.");
  }
}

searchBtn.addEventListener("click", () => {
  loadWeather(cityInput.value);
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadWeather(cityInput.value);
  }
});

settingsToggle.addEventListener("click", () => toggleSettingsPanel(true));
settingsClose.addEventListener("click", () => toggleSettingsPanel(false));
homeBtn.addEventListener("click", () => {
  loadWeather(defaultCity);
  toggleSettingsPanel(false);
});
headerSearchBtn.addEventListener("click", () => {
  loadWeather(defaultCity);
});
notificationBtn.addEventListener("click", () => {
  alert("No new notifications.");
});
darkModeToggle.addEventListener("click", () => {
  const isDark = bodyElement.classList.contains("dark-theme");
  applyTheme(isDark ? "light" : "dark");
});
themeButtons.forEach((button) => {
  button.addEventListener("click", () => applyTheme(button.dataset.theme));
});
styleButtons.forEach((button) => {
  button.addEventListener("click", () => applyStyle(button.dataset.style));
});
fontButtons.forEach((button) => {
  button.addEventListener("click", () => applyFont(button.dataset.font));
});
skyButtons.forEach((button) => {
  button.addEventListener("click", () => applyManualSkyTheme(button.dataset.sky));
});
signInBtn.addEventListener("click", () => {
  userSignedIn = true;
  updateAuthStatus();
});
signOutBtn.addEventListener("click", () => {
  userSignedIn = false;
  updateAuthStatus();
});

// Sky Background Management
function getSkyVibe() {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hour * 60 + minutes;

  // Determine time period
  // 5:00 - 6:30: Early Morning (Twilight)
  // 6:30 - 18:00: Daytime
  // 18:00 - 20:00: Sunset
  // 20:00 - 21:00: Twilight
  // 21:00 - 5:00: Starry Night / Deep Night

  if (hour >= 5 && hour < 6) return 'twilight-sky';
  if (hour >= 6 && hour < 18) return 'daytime-sky';
  if (hour >= 18 && hour < 20) return 'sunset-sky';
  if (hour >= 20 && hour < 21) return 'twilight-sky';
  if (hour >= 21 || hour < 5) return 'starry-night-sky';
  
  return 'daytime-sky';
}

function applyDynamicBackground() {
  // If user manually selected a sky theme, don't override it
  if (manualSkyTheme) return;
  
  const skyVibe = getSkyVibe();
  
  // Remove all sky classes
  bodyElement.classList.remove('daytime-sky', 'sunset-sky', 'twilight-sky', 'deepnight-sky', 'starry-night-sky');
  
  // Apply the appropriate sky class
  bodyElement.classList.add(skyVibe);
}

function applyManualSkyTheme(skyTheme) {
  manualSkyTheme = skyTheme;
  
  // Remove all sky classes
  bodyElement.classList.remove('daytime-sky', 'sunset-sky', 'twilight-sky', 'deepnight-sky', 'starry-night-sky');
  
  // Apply the selected sky theme
  bodyElement.classList.add(skyTheme);
}

// Update background every minute
setInterval(applyDynamicBackground, 60000);

async function initApp() {
  try {
    const res = await fetch('/config.json');
    if (res.ok) {
      const cfg = await res.json();
      if (cfg && cfg.OPENWEATHER_API_KEY) {
        API_KEY = cfg.OPENWEATHER_API_KEY;
      }
      if (cfg && (cfg.USE_MOCK === true || cfg.MOCK === true)) {
        USE_MOCK = true;
      }
    }
  } catch (e) {
    // no config file — proceed with existing API_KEY (placeholder)
  }

  initializeSubcitySection();
  updateAuthStatus();
  applyDynamicBackground(); // Apply sky background on init
  try { await loadWeather(defaultCity); } catch(e) { /* already handled */ }
}

initApp();
>>>>>>> 721b5b7 (updates)
