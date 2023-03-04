import axios from 'axios';
import { fetchNews } from './fetchNews';
const galleryContainer = document.querySelector('.gallery');
onload();

async function onload() {
  const response = await fetchNews.fetchNewsByPopular();
  const { results } = response;
  normalizedData(results);
  renderNewsCards();
  fetchNews.setNodeChild(document.querySelectorAll('.new-card'));
}
// const BASE_URL =
//   'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';

function normalizedData(data) {
  let img = null;
  const imageDescr = 'alt';
  data.forEach(element => {
    const media = element.media;
    media.forEach(e => {
      img = e['media-metadata'][2].url;
    });
  });
}
const pubDate = element.published_date.split('-').reverse().join('/');
function renderNewsCards() {
  //  cтворюємо новий масив
  const data = [];
  // отримуємо масив даних з екземпляру класу
  const fetchData = fetchNews.getData();
  // перебираємо маси та перші 8 елементів пушимо в renderData
  for (let i = 0; i < fetchData.length; i++) {
    if (i >= 8) break;
    data.push(fetchData[i]);
  }
  // створюємо строку розмітки
  const markUp = data.reduce((acc, el) => {
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
        <a class="news-card__more" href="${el.url}" id="${el.id}"}>Read more</a>
      </div>
    </div>`;
    return acc;
  }, ``);
  // додоємо створену розмітку в DOM
  galleryContainer.insertAdjacentHTML('beforeend', markUp);
}

function deleteNewsCards() {
  // видаляє повністю розмітку і  календар також (тимчасовий код)
  galleryContainer.innerHTML = '';
  // видаляє тільки newsCards, погода щзалишається, але працюватиме тільки, якщо при завантаженні сторінки вже рендер карток новин
  // const newsCards = fetchNews.getNodeChild();
  // newsCards.forEach(el => el.remove());
}
renderNewsCards();
