import VanillaCalendar from '@uvarov.frontend/vanilla-calendar';
import { Report } from 'notiflix/build/notiflix-report-aio';
const uniq = require('lodash.uniq');
import { spinner } from './Libraries';
import { fetchNews } from './FetchNews';
import {
  renderNewsCards,
  deleteNewsCards,
  saveSearchData,
  addClassesForCoincidencesMarkupAndStorage,
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

const btn = document.querySelector('.btn');
btn.addEventListener('click', callback);

callback();
//  це функція яка викликатиметься при натисканні на фільтр,
async function callback() {
  fetchNews.resetData();
  fetchNews.setFilterQuery('arts');
  deleteNewsCards();
  const response = await fetchNews.fetchNewsByFilter();
  console.log(response);
  const {
    data: { results },
  } = response;

  fetchNews.setHits(response.data.num_results);
  fetchNews.setFilterParams(fetchNews.getFilterParams());
  saveCategoryData(results);
  renderNewsCards();

  fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
  fetchNews.setIsUrlRequest(true);
  addClassesForCoincidencesMarkupAndStorage();
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

    fetchNews.setDate(date.split('-').join(''));
    const normaliseDate = date.split('-').reverse().join('/');
    inputEl.value = normaliseDate;
    calendarContainer.classList.add('is-hidden');
    deleteNewsCards();
    spinner.spin(document.body);

    if (fetchNews.getUrl().includes('articlesearch')) {
      fetchNews.resetData();
      fetchNews.resetStorageData();
      try {
        const response = await fetchNews.fetchNewsByDate();

        if (!response.data.response.docs.length) {
          logMessage();
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
        fetchNews.setIsUrlRequest(true);
        addClassesForCoincidencesMarkupAndStorage();
      } catch (error) {
        console.log(error);
        spinner.stop();
      }
    } else {
      const filtredData = fetchNews.getStorageData().filter(el => {
        return (
          normaliseDate === el.pubDate &&
          el.urlCategory === fetchNews.getFilterParams()
        );
      });

      if (!filtredData.length) {
        logMessage();
        return;
      }
      const uniqData = uniq(filtredData);

      fetchNews.setFiltredStorageData(uniqData);
      renderFiltredNewsCardByData(fetchNews.getFiltredStorageData());
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(false);
      // ----------> логіка localestorage
      addClassesForCoincidencesMarkupAndStorage();
    }
    spinner.stop();
  }
}

function logMessage() {
  console.log('нічого не знайдено');
  spinner.stop();
}

function renderFiltredNewsCardByData(data) {
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
