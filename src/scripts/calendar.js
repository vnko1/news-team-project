import VanillaCalendar from '@uvarov.frontend/vanilla-calendar';
import { Report } from 'notiflix/build/notiflix-report-aio';

import { spinner } from './libraries';
import { fetchNews } from './fetchNews';
import {
  renderNewsCards,
  deleteNewsCards,
  saveSearchData,
  addClassesForCoincidencesMarkupAndStorage,
  showNotFoundMessage,
  hideNotFoundMessage,
} from './commonFunctions';
import { deletePagination } from './pagination';

const calendar = new VanillaCalendar('#calendar');
calendar.init();

const inputEl = document.querySelector('#date');
const calendarContainer = document.querySelector('#calendar-container');
const calendarEl = document.querySelector('#calendar');
const gallery = document.querySelector('.gallery-container');
const dateContainer = document.querySelector('.date-container');

const currenDate = new Date().toLocaleDateString().split('.').join('/');
inputEl.placeholder = currenDate;
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
    const currentDate = new Date();
    const selectedDate = new Date(date);
    if (selectedDate.getTime() > currentDate.getTime()) {
      Report.info('Choose other date!');
      return;
    }

    fetchNews.setDate(date.split('-').join(''));
    const normalisedDate = date.split('-').reverse().join('/');
    inputEl.value = normalisedDate;
    calendarContainer.classList.add('is-hidden');
    deleteNewsCards();
    deletePagination();
    spinner.spin(document.body);
    hideNotFoundMessage();
    if (fetchNews.getUrl().includes('articlesearch')) {
      fetchNews.resetData();
      try {
        const response = await fetchNews.fetchNewsByDate();

        if (!response.data.response.docs.length) {
          showNotFoundMessage();
          spinner.stop();
          return;
        }
        fetchNews.setHits(response.data.response.meta.hits);

        const {
          data: {
            response: { docs },
          },
        } = response;

        fromBackNewsCardsCreation(docs);
      } catch (error) {
        console.log(error);
        spinner.stop();
      }
    } else if (fetchNews.getUrl().includes('content')) {
      const filtredData = fetchNews.getCategoryData().filter(el => {
        return normalisedDate === el.pubDate;
      });

      if (!filtredData.length) {
        showNotFoundMessage();
        spinner.stop();
        return;
      }
      fromFrontNewsCardsCreation(filtredData);
    } else {
      const filtredData = fetchNews.getStorageData().filter(el => {
        return normalisedDate === el.pubDate;
      });

      if (!filtredData.length) {
        showNotFoundMessage();
        spinner.stop();
        return;
      }

      fromFrontNewsCardsCreation(filtredData);
    }
  }
  spinner.stop();
}

function fromBackNewsCardsCreation(data) {
  saveSearchData(data);
  renderNewsCards();
  fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
  fetchNews.setIsUrlRequest(true);
  addClassesForCoincidencesMarkupAndStorage();
}

function fromFrontNewsCardsCreation(data) {
  renderFiltredNewsCardByData(data);
  fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
  fetchNews.setIsUrlRequest(false);
  addClassesForCoincidencesMarkupAndStorage();
}

// function logMessage() {
//   console.log('нічого не знайдено');
//   spinner.stop();
// }

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
        <button id ='${
          el.id
        }' class="mybtn label-favorite">Add to favorite</button>
        </div>
      </div>
      <h2 class="news-card__info-title">${el.title.limit(50, {
        ending: '',
      })}</h2>
      <p class="news-card__info-text">${el.description.limit(120)}</p>
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
