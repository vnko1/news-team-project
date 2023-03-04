import axios from 'axios';
import { fetchNews } from './FetchNews';
const galleryContainer = document.querySelector('.gallery');
console.log(fetchNews)
onload();

 async function onload() {
  const response = await fetchNews.fetchNewsByPopular();
  console.log(response);
  const { results } = response;

  normalizedData(results);
  renderNewsCards();
  fetchNews.setNodeChild(document.querySelectorAll('.new-card'));
}

function normalizedData(data) {
  let img = null;
  const imageDescr = 'alt';
  data.forEach(element => {
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

// function fetchNewsByPopular() {
//   // запит на бекенд
//   const data = axios.get(
//     'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY'
//   );
//   console.log(data);
//   // повертає дані з бекенду
//   return data;
// }


// onFormSubmit();

// async function onFormSubmit() {
//   try { 
    
//     fetchNews.setHits(response.meta.hits);
//     const { docs } = response;

//     docs.forEach(article => {
//       //обрізаємо опис якщо більше 200 символів
//       const infoText = fetchNews.cutInfo(article.lead_paragraph);
//       //   console.log(infoText);
//       //приводимо дату до потрібного формату
//       const date = fetchNews.formatDate(article.pub_date);

//       const multimedia = article.multimedia.find(
//         media => media.subtype === 'xlarge'
//       );

//       const image = multimedia
//         ? `https://www.nytimes.com/${multimedia.url}`
//         : `https://klike.net/uploads/posts/2020-09/1599896421_21.jpg`;
//       // console.log(image);

//       pushData(
//         article.headline.main, //заголовок
//         infoText, //короткий опис
//         article.section_name, //категорія
//         date, //дата
//         article.web_url, //read more
//         image, //картинка
//         article.keywords[0].value, //атрибут alt)
//         article._id //айдішник
//       );
//     });

//     deleteCards();

//     renderCards();
//   } catch (error) {
//     console.log;
//   }

//   //   console.log(fetchNews.getData());
// }

// //очищаємо картки
// function deleteCards() {
//   gallery.innerHTML = '';

//   // galleryList.forEach(el => (el.innerHTML = ''));
// }

// function pushData(
//   title,
//   description,
//   category,
//   pubDate,
//   url,
//   imgUrl,
//   imgDescr,
//   id
// ) {
//   fetchNews.addData(
//     fetchNews.createObj(
//       title,
//       description,
//       category,
//       pubDate,
//       url,
//       imgUrl,
//       imgDescr,
//       id
//     )
//   );
//   fetchNews.addStorageData(
//     fetchNews.createObj(
//       title,
//       description,
//       category,
//       pubDate,
//       url,
//       imgUrl,
//       imgDescr,
//       id
//     )
//   );
//   ``;
// }

// function renderCards() {
//   // треба ще зробити перевірку якщо нічого не приходить у відповідь то
//   const data = [];
//   const fetchData = fetchNews.getData();
//   //проходимося по отриманим даним (масив з 10 елементів) та вибираємо 8 з них для нашого рендеру
//   for (let i = 0; i < fetchData.length; i++) {
//     if (i >= 8) break;
//     data.push(fetchData[i]);
//   }
//   const markUp = data.reduce((acc, el) => {
//     acc += `
// <div class="news-card" news-id="${el.id}">
//     <div class="news-card__img">
//       <p class="news-card__theme">${el.category}</p>
//       <img class="news-card__item"
//           src="${el.imgUrl}"
//           alt="${el.imgDescr ? el.imgDescr : 'photo'}"
//           loading="lazy"
//           width="395"
//         />
//         <div class="news-card__favorite">
//           <label for="favorite" class="label-favorite">Add to favorite</label>
//           <input type="checkbox" class="input-favorite" id="favorite" />
//         </div>
//       </div>
//       <h2 class="news-card__info-title">${el.title}</h2>
//       <p class="news-card__info-text">${el.description}</p>
//       <div class="news-card__additional">
//         <p class="news-card__date">${el.pubDate}</p>
//         <a class="news-card__more" href="${
//           el.url
//         }" target='_blanc'>Read more</a>
//       </div>
//     </div>`;
//     return acc;
//   }, ``);

//   galleryContainer.insertAdjacentHTML('beforeend', markUp);
// }
