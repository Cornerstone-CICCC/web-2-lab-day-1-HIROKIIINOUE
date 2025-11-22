const searchBtn = document.querySelector("#submit");
const searchInput = document.querySelector("#search-city");
const cityNameDisplay = document.querySelector("#city");
const countryNameDisplay = document.querySelector("#country-name");
const cityTimeZoneDisplay = document.querySelector("#city-timezone");
const cityPopulationDisplay = document.querySelector("#city-population");

const cityTemperatureDisplay = document.querySelector("#temperature");
const cityMaxTemperatureDisplay = document.querySelector("#max-temperature");
const cityMinTemperatureDisplay = document.querySelector("#min-temperature");
const backgroundImg = document.querySelector("#background-image");
const titleDisplay = document.querySelector("#title");
const mainDisplay = document.querySelector("#main-display");

const getCityData = async (cityName) => {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`
    );
    const cityData = await res.json();

    return cityData;
  } catch (error) {
    console.error(error);
  }
};

const getWeatherData = async (latitude, longitude) => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
    );
    const weatherData = await res.json();
    return weatherData;
  } catch (error) {
    console.error(error);
  }
};

searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const searchingValue = searchInput.value;
  const cityData = await getCityData(searchingValue);
  const cityDataResult = cityData.results[0];

  const currentCityCountryName = cityDataResult.country;
  const currentCityName = cityDataResult.name;
  const currentCityTimeZone = cityDataResult.timezone;
  const currentCityPopulation = cityDataResult.population;
  const currentCityLatitude = cityDataResult.latitude;
  const currentCityLongitude = cityDataResult.longitude;

  cityNameDisplay.textContent = currentCityName;
  countryNameDisplay.textContent = currentCityCountryName;
  cityTimeZoneDisplay.textContent = currentCityTimeZone;
  cityPopulationDisplay.textContent = currentCityPopulation;

  const weatherData = await getWeatherData(
    currentCityLatitude,
    currentCityLongitude
  );

  const currentTemperature = weatherData.current.temperature_2m;
  const maxTemperature = weatherData.daily.temperature_2m_max[0];
  const minTemperature = weatherData.daily.temperature_2m_min[0];
  const isDay = weatherData.current.is_day;

  // judge day or night to decide background image
  if (isDay === 1) {
    backgroundImg.classList.remove("background-image-night");
    backgroundImg.classList.add("background-image-day");
    titleDisplay.classList.remove("night-title");
    titleDisplay.classList.add("day-title");
  } else if (isDay === 0) {
    backgroundImg.classList.remove("background-image-day");
    backgroundImg.classList.add("background-image-night");
    titleDisplay.classList.remove("day-title");
    titleDisplay.classList.add("night-title");
  }

  cityTemperatureDisplay.textContent = `${currentTemperature}℃`;
  cityMinTemperatureDisplay.textContent = `Low: ${minTemperature} ℃`;
  cityMaxTemperatureDisplay.textContent = `Max: ${maxTemperature} ℃`;

  mainDisplay.classList.remove("main-hidden");
  mainDisplay.classList.add("main-display");
});
