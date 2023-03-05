import { fetchNews } from './FetchNews';

const gallery = document.querySelector('.gallery-container');

// повертає обʼєкт з даними
function createObj({
  title = 'no data',
  description = 'no data',
  category = 'no data',
  pubDate = 'no data',
  url = 'no data',
  img,
  imgDescr = 'no data',
  id = 'no data',
}) {
  const imgUrl = img ? img : 'https://unsplash.it/395';

  return {
    title,
    description,
    category,
    pubDate,
    url,
    imgUrl,
    imgDescr,
    id,
  };
}

function renderNewsCards() {
  //  cтворюємо новий масив
  const renderData = [];
  // отримуємо масив даних з екземпляру класу
  const fetchData = fetchNews.getData();
  // перебираємо маси та перші 8 елементів пушимо в renderData
  for (let i = 0; i < fetchData.length; i++) {
    if (i >= 8) break;
    renderData.push(fetchData[i]);
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

function deleteNewsCards() {
  // видаляє повністю розмітку і  календар також (тимчасовий код)
  gallery.innerHTML = '';
  // видаляє тільки newsCards, погода щзалишається, але працюватиме тільки, якщо при завантаженні сторінки вже рендер карток новин
  // const newsCards = fetchNews.getNodeChild();
  // newsCards.forEach(el => el.remove());
}

export { createObj, renderNewsCards, deleteNewsCards };
