<<<<<<< Updated upstream
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
=======
import { fetchNews } from './fetchNews';

const galleryContainer = document.querySelector('.gallery');

// const BASE_URL =
//   'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';

// const res = fetch(BASE_URL)
//   .then(res => res.json())
//   .then(data => {
//     // console.log(data);
//     const slicedData = data.results.slice(0, 8);
//     createDivMarkup(slicedData);
//     console.log(slicedData);
//   })
//   .catch(error => {
//     console.log(error);
//   });

function renderNewsCards() {
  //  cтворюємо новий масив
  const renderData = [];
>>>>>>> Stashed changes
  // отримуємо масив даних з екземпляру класу
  const fetchData = fetchNews.getData();
  // перебираємо маси та перші 8 елементів пушимо в renderData
  for (let i = 0; i < fetchData.length; i++) {
    if (i >= 8) break;
<<<<<<< Updated upstream
    data.push(fetchData[i]);
  }
  // створюємо строку розмітки
  const markUp = data.reduce((acc, el) => {
=======
    renderData.push(fetchData[i]);
  }

  const markUp = renderData.reduce((acc, el) => {
>>>>>>> Stashed changes
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
renderNewsCards();

// function createDivMarkup(data) {
//   const markup = data.reduce((acc, data) => createMarkup(data) + acc, '');

//   updateDivMarkup(markup);
// }

<<<<<<< Updated upstream
function deleteNewsCards() {
  // видаляє повністю розмітку і  календар також (тимчасовий код)
  galleryContainer.innerHTML = '';
  // видаляє тільки newsCards, погода щзалишається, але працюватиме тільки, якщо при завантаженні сторінки вже рендер карток новин
  // const newsCards = fetchNews.getNodeChild();
  // newsCards.forEach(el => el.remove());
}
renderNewsCards();
=======
// function updateDivMarkup(markup) {
//   galleryContainer.innerHTML = markup;
// }
// function createMarkup(dataOfOneCard) {
//   // media = media[0]['media-metadata'][2].url;
//   const { media, title, abstract, published_date, url, id } = dataOfOneCard;
//   // console.log(dataOfOneCard)

//   const date = new Date(published_date);
//   const convertDate = `${String(date.getDate()).padStart(2, 0)}/${String(
//     date.getMonth() + 1
//   ).padStart(2, 0)}/${String(date.getFullYear())}`;

//   {
//     /* <img class="card__img" src="https://static01.nyt.com/${multimedia[0].url}" alt="Заглушка" width="395" height="395"></img> */
//   }
//   return `
//       <div class="card">
//       <div class="news-card__img">
//       <img class="card__img" src="https://static01.nyt.com/${media}" alt="Заглушка" width="395" height="395"></img>
//         <h2 class="card__title" data-card-title>${title}</h2>
//         <p class="card__description">${abstract}</p>
//         <p class="card__news-create-date">${convertDate}</p>
//         <a class="card__news-link" href="${url}" id="${id}">Read more</a>
//         <button class="card__btn">Add to favorite</button>
//         <div>
//       </div>
//     `;
// }

// const res = fetch(BASE_URL)
//   .then(res => res.json())
//   .then(data => {
//     // console.log(data.response.docs);
//     createDivMarkup(data.results);
//     const slicedData = data.results.slice(0, 8);
//     createDivMarkup(slicedData);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// //----------------------------------------------------------

// function createMarkup(dataOfOneCard) {
//   const {
//     multimedia,
//     headline: { main },
//     abstract,
//     pub_date,
//     web_url,
//     _id,
//   } = dataOfOneCard;
//   // console.log(dataOfOneCard)
//   function createDivMarkup(data) {
//     const markup = data.reduce((acc, data) => createMarkup(data) + acc, '');

//     updateDivMarkup(markup);
//   }

//   function updateDivMarkup(markup) {
//     galleryContainer.innerHTML = markup;
//   }
//   const date = new Date(pub_date);
//   const convertDate = `${String(date.getDate()).padStart(2, 0)}/${String(
//     date.getMonth() + 1
//   ).padStart(2, 0)}/${String(date.getFullYear())}`;

//   {
//     /* <img class="card__img" src="https://static01.nyt.com/${multimedia[0].url}" alt="Заглушка" width="395" height="395"></img> */
//   }
//   return `
//     <div class="card">
//       <h2 class="card__title" data-card-title>${main}</h2>
//       <p class="card__description">${abstract}</p>
//       <p class="card__news-create-date">${convertDate}</p>
//       <a class="card__news-link" href="${web_url}" id="${_id}">Read more</a>
//       <button class="card__btn">Add to favorite</button>
//     </div>
//   `;
// }
>>>>>>> Stashed changes
