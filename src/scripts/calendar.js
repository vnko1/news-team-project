import VanillaCalendar from '@uvarov.frontend/vanilla-calendar';
const uniq = require('lodash.uniq');
import { spinner } from './Spinner';
import { fetchNews } from './fetchNews';
import {
  createObj,
  renderNewsCards,
  deleteNewsCards,
  saveSearchData,
} from './CommonFunctions';

const calendar = new VanillaCalendar('#calendar');
calendar.init();

const inputEl = document.querySelector('#date');
const calendarContainer = document.querySelector('#calendar-container');
const calendarEl = document.querySelector('#calendar');
const gallery = document.querySelector('.gallery-container');
const dateContainer = document.querySelector('.date-container');

inputEl.addEventListener('click', onInputElClick);
calendarEl.addEventListener('click', onDateClick);

function onInputElClick() {
  calendarContainer.classList.remove('is-hidden');
  document.addEventListener('click', onWindowClick);
}

function onWindowClick(e) {
  const withinBoundaries = e.composedPath().includes(dateContainer);

  if (!withinBoundaries) {
    calendarContainer.classList.add('is-hidden');
    document.removeEventListener('click', onWindowClick);
  }
}

async function onDateClick(e) {
  if (e.target.hasAttribute('data-calendar-day')) {
    const date = e.target.getAttribute('data-calendar-day');
    const unixDate = new Date();
    const selectedDate = new Date(date);

    if (selectedDate.getTime() > unixDate.getTime()) {
      console.log('введіть сьоднішню дату');
      return;
    }
    deleteNewsCards();
    fetchNews.setDate(date.split('-').join(''));

    const normalDate = date.split('-').reverse().join('/');
    inputEl.value = normalDate;
    calendarContainer.classList.add('is-hidden');

    spinner.spin(document.body);
    if (fetchNews.getUrl().includes('articlesearch')) {
      fetchNews.resetData();
      try {
        const response = await fetchNews.fetchNewsByDate();

        if (!response.data.response.docs.length) {
          console.log('нічого не знайдено');
          spinner.stop();
          return;
        }
        fetchNews.setHits(response.data.response.meta.hits);
        const {
          data: {
            response: { docs },
          },
        } = response;

        saveSearchData(docs);

        renderNewsCards();
        spinner.stop();
        fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      } catch (error) {
        console.log(error);
      }
    } else {
      if (!fetchNews.getStorageData().length) {
        console.log('нічого не знайдено');
        spinner.stop();
        return;
      }
      const filtredData = fetchNews
        .getStorageData()
        .filter(el => el.pubDate === normalDate);
      const uniqData = uniq(filtredData);

      renderFilterfNewsCardByData(uniqData);
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
    }
    spinner.stop();
  }
}

function renderFilterfNewsCardByData(data) {
  const renderData = [];

  // перебираємо маси та перші 8 елементів пушимо в renderData
  for (let i = 0; i < data.length; i++) {
    if (i >= 8) break;
    renderData.push(data[i]);
  }

  // створюємо строку розмітки
  const markUp = renderData.reduce((acc, el) => {
    acc += `<div class="news-card" news-id="${el.id}">
      <div class="news-card__img">
        <p class="news-card__theme">${el.category}</p>
        <img
          class="news-card__item"
          src="${el.imgUrl}"
          alt="${el.imgDescr ? el.imgDescr : 'photo'}"
          loading="lazy"
          width="395"
        />
        <div class="news-card__favorite">
          <label for="favorite" id="${
            el.id
          }" class="label-favorite">Add to favorite</label>
          <input type="checkbox" class="input-favorite" id="favorite"/>
        </div>
      </div>
      <h2 class="news-card__info-title">${el.title}</h2>
      <p class="news-card__info-text">${
        el.description.length > 180
          ? el.description.slice(0, 180) + '...'
          : el.description
      }</p>
      <div class="news-card__additional">
        <p class="news-card__date">${el.pubDate}</p>
        <a class="news-card__more" href="${el.url}" id="${
      el.id
    }"target="_blank" rel="noreferrer noopener">Read more</a>
      </div>
    </div>`;
    return acc;
  }, ``);
  // додоємо створену розмітку в DOM
  gallery.insertAdjacentHTML('beforeend', markUp);
}
