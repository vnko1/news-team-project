import WeatherApiService from '../scripts/FetchWeather';

const refs = {
  weatherCard: document.querySelector('.weather-card'),
  weatherTemp: document.querySelector('.weather-card__temp'),
  weatherNow: document.querySelector('.weather-card__now'),
  weatherLocate: document.querySelector('.weather-card__locate'),
  weatherDate: document.querySelector('.weather-card__date'),
  weatherDateTheWeek: document.querySelector('.weather-card__week'),
  weatherCards: document.querySelector('#weather-cards'),
  weatherImg: document.querySelector('.weather-picture > img'),
  weatherForMe: document.querySelector('.weather-card__top'),
};
//==================
// refs.weatherDate
// refs.weatherCard
// const btnBtnEl = document.querySelector('.weather-card__week');
//==================

// console.log(refs.weatherImg)
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
    getDateToday(data);
  } catch {}
}

function appendWeatherToCard(data) {
  refs.weatherCard.innerHTML = `
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
          ${getDateToday(data)}
        </p>
        <button class="weather-card__week">
          <a class="weather-card__week-link href=">weather for week</a>
        </button>
      </div>
  `;

  const btnBtnEl = document.querySelector('.weather-card__week');
  btnBtnEl.addEventListener('click', onWeatherWeekCards);
}

function getDateToday(data) {
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
    dayOfWeek + ' ' + dayOfMonth + ' ' + monthOfYear + ' ' + year;
  refs.weatherDate.textContent = formattedDate;
  return formattedDate;
}

refs.weatherDateTheWeek.addEventListener('click', onWeatherWeekCards);

async function onWeatherWeekCards() {
  try {
    const response = await weatherApiService.loadWeatherWeek();
    const data = response.data;

    markupWeekWeather(data.daily);

    const btnEl = document.querySelector('.newbtn');

    btnEl.addEventListener('click', dailyWeather);

  } catch {}
}

function markupWeekWeather(data) {
  const markUp = data.reduce((acc, el) => {
    acc += `
    <div class=week-weather>
      <div>${dayOfArr(el)}</div>
      <img
          class="week-weather-icon"
          src="https://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png"
          width = '40'
          heigth = '40'
        />
    <span class="week-weather-max-temp">${Math.round(el.temp.max)}</span>
    <span class="week-weather-min-temp">/ ${Math.round(el.temp.min)}°C</span>
      
    </div>
    
    `;
    return acc;
  }, ``);

  const newMarkup =
    markUp +
    `
  <button class="weather-card__week newbtn">weather for day</button>
  `;

  refs.weatherCard.innerHTML = newMarkup;
}

async function dailyWeather() {
  try {
    const response = await weatherApiService.loadWeather();
    const data = response.data;

    refs.weatherCard.innerHTML = `
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
          ${getDateToday(data)}
        </p>
        <button class="weather-card__week">
          <a class="weather-card__week-link href=">weather for week</a>
        </button>
      </div>
  `;

    const btnBtnEl = document.querySelector('.weather-card__week');
    btnBtnEl.addEventListener('click', onWeatherWeekCards);

    navigator.geolocation.getCurrentPosition(showPosition, onError);

    // loadWeathetData();
  } catch {}
}

function dayOfArr(data) {
  const timestamp = data.dt;
  // console.log(timestamp)
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
    dayOfWeek + ' ' + dayOfMonth + ' ' + monthOfYear + ' ' + year;
  // refs.weatherDate.textContent = formattedDate;
  return formattedDate;
}