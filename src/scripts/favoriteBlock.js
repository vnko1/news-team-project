import {
  getStorageList,
  addClassesForCoincidencesMarkupAndStoragePages,
} from './commonFunctions'; // імпорт  функції для взяття  данних з сториджу
import { Report } from 'notiflix/build/notiflix-report-aio';
import { spinner } from './libraries';

// gallery-container - додатковий класс на контейнер в якому малюється розмітка
const gallery = document.querySelector('.gallery-container');

onLoadFavorite();
addClassesForCoincidencesMarkupAndStoragePages();

function onLoadFavorite() {
  // функція загрузки зі сториджа та перевірки парсінгу
  spinner.spin(document.body);
  try {
    const keyFavorite = localStorage.getItem('favourites');
    const parsedFavorite = JSON.parse(keyFavorite);
    if (parsedFavorite === null) {
      spinner.stop();
      return;
    } else if (parsedFavorite.length === 0) {
      spinner.stop();
      Report.info('You have no favorite news yet!');
    } else {
      renderFavouriteCardFromStorage();
      spinner.stop();
    }
  } catch (error) {
    console.log(error);
  }
}

function renderFavouriteCardFromStorage() {
  //  функція для отримання масиву з сториджа
  const arrFavourites = getStorageList('favourites');

  // створюємо строку розмітки
  const markUp = arrFavourites.reduce((acc, el) => {
    acc += `<div class="news-card" news-id="${el.id}">
      <div class="news-card__img">
        <p class="news-card__theme">${el.category}</p>
        <img
          class="news-card__item"
          src="${el.img}"
          alt="${el.alt ? el.alt : 'photo'}"
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
      <p class="news-card__info-text">${el.descr.limit(180)}</p>
      <div class="news-card__additional">
        <p class="news-card__date">${el.dateArticle}</p>
        <a class="news-card__more" href="${el.link}" id="${
      el.id
    }" target="_blank" rel="noreferrer noopener"}>Read more</a>
      </div>
    </div>`;
    return acc;
  }, ``);

  gallery.insertAdjacentHTML('beforeend', markUp);
}

gallery.addEventListener('click', onClickRemoveBtn);

function onClickRemoveBtn(e) {
  if(e.target.tagName === 'BUTTON') {
    e.target.parentNode.parentNode.parentNode.remove();
  }
}
