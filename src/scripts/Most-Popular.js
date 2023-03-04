// import axios from 'axios';
import { fetchNews } from './fetchNews';
const galleryContainer = document.querySelector('.gallery');
// // console.log(fetchNews)
const BASE_URL =
  'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';

const res = fetch(BASE_URL)
  .then(res => res.json())
  .then(data => {
    console.log(data.results);
    normalizedData(data.results);
    renderNewsCards();
      fetchNews.setNodeChild(document.querySelectorAll('.new-card'));
    
  })
  .catch(error => {
    console.log(error);
  });
// onload();

// function onload() {
//   const response = fetchNewsByPolular();
//   console.log(response);
//   // const { results } = response;

//   // normalizedData(results);
//   // renderNewsCards();
//   // fetchNews.setNodeChild(document.querySelectorAll('.new-card'));
// }

function normalizedData(data) {
  let img = null;
  const imageDescr = 'alt';
  data.forEach(element => {
    console.log(element.media)
    const media = element.media;
    media.forEach(e => {
      img = e['media-metadata'][2].url;
    });
  });

  const pubDate = element.published_date.split('-').reverse().join('/');

  pushData(
    element.title,
    element.abstract,
    element.section,
    pubDate,
    element.url,
    img,
    imageDescr,
    element.id
  );

  deleteCards();
  // fetchNewsByDate();

  function pushData(
    title,
    description,
    category,
    pubDate,
    url,
    imgUrl,
    imgDescr,
    id
  ) {
    fetchNews.addData(
      fetchNews.createObj(
        title,
        description,
        category,
        pubDate,
        url,
        imgUrl,
        imgDescr,
        id
      )
    );
    fetchNews.addStorageData(
      fetchNews.createObj(
        title,
        description,
        category,
        pubDate,
        url,
        imgUrl,
        imgDescr,
        id
      )
    );
    ``;
  }
}

function deleteCards() {
  galleryContainer.innerHTML = '';

  // galleryList.forEach(el => (el.innerHTML = ''));
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
        <a class="news-card__more" href="${el.url}" id="${el.id}"}>Read more</a>
      </div>
    </div>`;
    return acc;
  }, ``);
  // додоємо створену розмітку в DOM
  galleryContainer.insertAdjacentHTML('beforeend', markUp);
}

// function fetchNewsByPolular() {
//   const data = axios.get(
//     'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json',
//     {
//       params: {
//         'api-key': '6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY',
//       },
//     }
//   );
// console.log(data);
//   // return data;
// }

// const BASE_URL =
//   'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';

// const res = fetch(BASE_URL)
//   .then(res => res.json())
//   .then(data => {
//     console.log(data.results);
//     // createDivMarkup(data.response.docs);
//   })
//   .catch(error => {
//     console.log(error);
//   });
// console.log(res)
// function createDivMarkup(data) {
//   const markup = data.reduce((acc, data) => createMarkup(data) + acc, '');

//   updateDivMarkup(markup);
// }

// function updateDivMarkup(markup) {
//   galleryContainer.innerHTML = markup;
// }
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
