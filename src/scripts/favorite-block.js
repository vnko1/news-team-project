import {
  getStorageList,
  addClassesForCoincidencesMarkupAndStorage,
} from './CommonFunctions'; // імпорт  функції для взяття  данних з сториджу

// gallery-container - додатковий класс на контейнер в якому малюється розмітка
const gallery = document.querySelector('.gallery-container');

renderFavouriteCardFromStorage();

addClassesForCoincidencesMarkupAndStorage();

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
          <label for="favorite" id="${
            el.id
          }" class="label-favorite">Add to favorite</label>
          <input type="checkbox" class="input-favorite" id="favorite"/>
        </div>
      </div>
      <h2 class="news-card__info-title">${el.title}</h2>
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
