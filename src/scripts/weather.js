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
  weatherForMe: document.querySelector('.weather-card__top')
};

// console.log(refs.weatherImg)
const weatherApiService = new WeatherApiService();

navigator.geolocation.getCurrentPosition(showPosition, onError)

async function showPosition(position) {
  try {
    console.log(position)
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
    console.log(data)
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
        <img class="img" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="" width="165" />
      </picture>
      <div class="weather-card__bottom">
        <p class="weather-card__date">
          ${getDateToday(data)}
        </p>
        <button class="weather-card__week">
          <a class="weather-card__week-link href=">weather for week</a>
        </button>
      </div>
  `

  const btnBtnEl = document.querySelector('.weather-card__week');
  btnBtnEl.addEventListener('click', onWetherWeekCards);
  // console.log(3)
  // refs.weatherLocate.textContent = data.name;
  // console.log(4)
  // refs.weatherTemp.textContent = Math.round(data.main.temp);
  // console.log(5)
  // refs.weatherNow.textContent = data.weather[0].main;
  // console.log(6)
  // const icon = data.weather[0].icon;
  // refs.weatherImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function getDateToday(data) {
  const timestamp = data.dt;
  console.log(7)
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

refs.weatherDateTheWeek.addEventListener('click', onWetherWeekCards);

//function to update Forecast
async function onWetherWeekCards() {
  try {
      const response = await weatherApiService.loadWeatherWeek();
      const data = response.data;
      
      // console.log(data) 
      myQWE(data.daily)

      const btnEl = document.querySelector('.newbtn')
      console.log(btnEl)

      btnEl.addEventListener('click', newFunc);
    // const unit = '°C';
    // const type = 'week';

    // updateForecast(data, unit, type);
    refs.weatherDateTheWeek.disabled = true;
    refs.weatherDateTheWeek.disabled = false;
  } catch {}
}

function myQWE (data) {
  // const arr = data.daily
  // console.log(arr)
  console.log('data', data)
  // 6 / 0°C
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

  const newMarkup = markUp + `
  <button class="weather-card__week newbtn">weather for day</button>
  `

  // refs.weatherForMe.innerHTML = newMarkup;
  refs.weatherCard.innerHTML = newMarkup;

}

async function newFunc() {
  try {
    const response = await weatherApiService.loadWeather();
    const data = response.data;
    console.log('новая дата', data)
    // appendWeatherToCard(data);
    // getDateToday(data);
  

  // data.name

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
        <img class="img" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="" width="165" />
      </picture>
      <div class="weather-card__bottom">
        <p class="weather-card__date">
          ${getDateToday(data)}
        </p>
        <button class="weather-card__week">
          <a class="weather-card__week-link href=">weather for week</a>
        </button>
      </div>
  `
 
  const btnBtnEl = document.querySelector('.weather-card__week');
  btnBtnEl.addEventListener('click', onWetherWeekCards);

  navigator.geolocation.getCurrentPosition(showPosition, onError)

  // loadWeathetData();
} catch {}
  console.log(1)
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
  return formattedDate
}


















// function updateForecast(data, unit, type) {
//   refs.weatherCard.innerHTML = '';
//   let day = 0;
//   let numCards = 0;
//   if (type === 'day') {
//     numCards = 24;
//   } else {
//     numCards = 7;
//   }
//   console.log(numCards)
//   for (let i = 0; i < numCards; i++) {
//     let card = document.createElement('div');
//     console.log(card)
//     card.classList.add('card');
//     let dayName = getHour(data[day].datetime);
//     if (type === 'week') {
//       dayName = getDayName();
//       console.log(dayName)
//     }
//     let dayTemp = data[day].temp;
//     if (unit === 'f') {
//       dayTemp = celciusToFahrenheit(data[day].temp);
//     }
//     let iconCondition = data[day].icon;
//     let iconSrc = getIcon(iconCondition);
//     let tempUnit = '°C';
//     if (unit === 'f') {
//       tempUnit = '°F';
//     }
//     refs.weatherCard.innerHTML = `
//       <h2 class="day-name">${dayName}</h2>
//       <div class="card-icon">
//         <img src="${iconSrc}" class="day-icon" alt="" />
//       </div>
//       <div class="day-temp">
//         <h2 class="temp">${dayTemp}</h2>
//         <span class="temp-unit">${tempUnit}</span>
//       </div>
//     `;
//     refs.weatherCard.appendChild(card);
//     day++;
//   }
// }
// // function to conver celcius to fahrenheit
// function celciusToFahrenheit(temp) {
//   return ((temp * 9) / 5 + 32).toFixed(1);
// }
// // function to get day name from date
// function getDayName(date) {
//   let day = new Date(date);
//   let days = [
//     'Sunday',
//     'Monday',
//     'Tuesday',
//     'Wednesday',
//     'Thursday',
//     'Friday',
//     'Saturday',
//   ];
//   return days[day.getDay()];
// }

















