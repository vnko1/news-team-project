import { fetchNews } from './FetchNews';
import {
  saveSearchData,
  addClassesForCoincidencesMarkupAndStorage,
  renderNewsCards,
  deleteNewsCards,
} from './CommonFunctions';

const gallery = document.querySelector('.gallery-container');
const btn = document.querySelector('.pagination');
btn.addEventListener('click', onHandlePaginationClick);

async function onHandlePaginationClick() {
  fetchNews.incrementPage();

  deleteNewsCards();
  if (fetchNews.getUrl().includes('articlesearch')) {
    fetchNews.resetData();
    fetchNews.resetStorageData();
    try {
      const response = await fetchNews.fetchPagination();
      if (!response.data.response.docs.length) {
        console.log('закінчились новини');
        return;
      }
      const {
        data: {
          response: { docs },
        },
      } = response;

      saveSearchData(docs);
      renderNewsCards();

      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(true);
      addClassesForCoincidencesMarkupAndStorage();
    } catch (error) {
      console.log(error);
    }
  } else {
    if (!fetchNews.isUrlRequest) {
    } else {
      const data = fetchNews.getStorageData();

      renderPerPageNewsCardByData(data);
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(true);

      addClassesForCoincidencesMarkupAndStorage();
    }
    // console.log(fetchNews.getData());
    // console.log(fetchNews.getStorageData());
  }
}

function renderPerPageNewsCardByData(data) {
  const array = [...data];
  const subArray = breakUp(array);
  const renderData = [];
  console.log(fetchNews.getPage());
  // перебираємо маси та перші 8 елементів пушимо в renderData
  for (let i = 0; i < array.length; i++) {
    if (!subArray[fetchNews.getPage()][i]) {
      continue;
    }
    renderData.push(subArray[fetchNews.getPage()][i]);
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

function breakUp(array) {
  const arr = [];
  for (let i = 0; i < array.length; i += 8) {
    arr.push(array.slice(i, i + 8));
  }
  return arr;
}
