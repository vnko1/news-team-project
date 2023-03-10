import WeatherApiService from './fetchWeather';
import { spinner } from './libraries';

const weatherCardEl = document.querySelector('.weather-card');

const weatherApiService = new WeatherApiService();

navigator.geolocation.getCurrentPosition(showPosition, onError);

async function showPosition(position) {
  try {
    weatherApiService.lat = position.coords.latitude;
    weatherApiService.lon = position.coords.longitude;
    loadWeathetData();
  } catch {}
}

async function onError() {
  try {
    weatherApiService.lat = 50.4333;
    weatherApiService.lon = 30.5167;
    loadWeathetData();
  } catch {}
}

async function loadWeathetData() {
  try {
    const response = await weatherApiService.loadWeather();
    const data = response.data;

    appendWeatherToCard(data);
  } catch {}
}

function appendWeatherToCard(data) {
  weatherCardEl.innerHTML = `
  <div class="weather-card__top">
        <div class="weather-card__temp">${Math.round(data.main.temp)}°</div>
        <div class="weather-card__top-right">
          <p class="weather-card__now">${data.weather[0].main}</p>
          <button class="weather-card__locate">
            ${data.name}
          </button>
        </div>
      </div>
      <picture class="weather-picture">
        <img class="img" src="https://openweathermap.org/img/wn/${
          data.weather[0].icon
        }@2x.png" alt="" width="165" />
      </picture>
      <div class="weather-card__bottom">
        <p class="weather-card__date">
          ${daysOfWeather(data)}
        </p>
        <button class="weather-card__week">
          <a class="weather-card__week-link href=">weather for week</a>
        </button>
      </div>
  `;

  const btnBtnEl = document.querySelector('.weather-card__week');
  btnBtnEl.addEventListener('click', onWeatherWeekCards);
}

async function onWeatherWeekCards() {
  try {
    spinner.spin(weatherCardEl);
    const response = await weatherApiService.loadWeatherWeek();
    const data = response.data;

    markupWeekWeather(data.daily);

    const btnEl = document.querySelector('.newbtn');

    btnEl.addEventListener('click', dailyWeather);
  } catch {
    spinner.stop();
  }
  spinner.stop();
}

function markupWeekWeather(data) {
  const markUp = data.reduce((acc, el) => {
    acc += `
    <div class="week-weather">
      <div class="day-of-week">${daysOfWeather(el)}</div>
      <img
          class="week-weather-icon"
          src="https://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png"
          width = '40'
          heigth = '40'
        />
    <span class="week-weather-temp">${Math.round(el.temp.max)}</span>
    <span class="week-weather-temp">/ ${Math.round(el.temp.min)}°C</span>
    </div>
    `;
    return acc;
  }, ``);

  const newMarkup =
    markUp +
    `
    <button class="weather-card__week newbtn">
      <a>weather for day</a>
    </button>
  `;

  weatherCardEl.innerHTML = newMarkup;
}

async function dailyWeather() {
  try {
    const response = await weatherApiService.loadWeather();
    const data = response.data;

    weatherCardEl.innerHTML = `
  <div class="weather-card__top">
        <div class="weather-card__temp">${Math.round(data.main.temp)}</div>
        <div class="weather-card__top-right">
          <p class="weather-card__now">${data.weather[0].main}</p>
          <button class="weather-card__locate">
            ${data.name}
          </button>
        </div>
      </div>
      <picture class="weather-picture">
        <img class="img" src="https://openweathermap.org/img/wn/${
          data.weather[0].icon
        }@2x.png" alt="" width="165" />
      </picture>
      <div class="weather-card__bottom">
        <p class="weather-card__date">
          ${daysOfWeather(data)}
        </p>
        <button class="weather-card__week">
          <a class="weather-card__week-link href=">weather for week</a>
        </button>
      </div>
  `;

    const btnBtnEl = document.querySelector('.weather-card__week');
    btnBtnEl.addEventListener('click', onWeatherWeekCards);

    navigator.geolocation.getCurrentPosition(showPosition, onError);
  } catch {}
}

function daysOfWeather(data) {
  const timestamp = data.dt;
  const date = new Date(timestamp * 1000);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var monthsOfYear = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthOfYear = monthsOfYear[date.getMonth()];
  const year = date.getFullYear();
  const formattedDate =
    dayOfWeek + '<br>' + dayOfMonth + ' ' + monthOfYear + ' ' + year;
  return formattedDate;
}
