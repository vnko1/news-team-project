import { Report } from 'notiflix/build/notiflix-report-aio';
import { spinner } from './libraries';
import { addClassesForCoincidencesMarkupAndStoragePages } from './commonFunctions';

const cardList = document.getElementById('ul-gallery');
const spinnerContainer = document.querySelector('.spinner-container');

onParse();

function onParse() {
  spinner.spin(document.body);
  try {
    const unparsed = localStorage.getItem('read more');
    const parsed = JSON.parse(unparsed);

    if (parsed === null) {
      spinner.stop();
      return;
    } else if (parsed.length === 0) {
      spinner.stop();
      Report.info('There are no news You have read');
    } else {
      renderMarkup(parsed);
      spinner.stop();
    }
  } catch (err) {
    console.error(err);
    spinner.stop();
  }
}

function renderMarkup(array) {
  let cardMarkup = '';

  // -------сортируем даты по убыванию и выделяем уникальные даты---------

  const initialDates = array.map(obj => obj.date);
  const descendingDates = [...initialDates]
    .sort((a, b) => b - a)
    .map(dateUnix => {
      const dateStamp = new Date(dateUnix);

      return `${String(dateStamp.getDate()).padStart(2, 0)}/${String(
        dateStamp.getMonth() + 1
      ).padStart(2, 0)}/${String(dateStamp.getFullYear())}`;
    });
  const uniqueDates = descendingDates.filter(
    (course, index, array) => array.indexOf(course) === index
  );

  //------- создаем массив объектов с датой в формате day/month/year---------

  const arrayConverDates = array.reduce((acc, obj) => {
    const newObj = {};
    const dateStamp = new Date(obj.date);

    newObj.date = `${String(dateStamp.getDate()).padStart(2, 0)}/${String(
      dateStamp.getMonth() + 1
    ).padStart(2, 0)}/${String(dateStamp.getFullYear())}`;
    newObj.img = obj.img;
    newObj.descr = obj.descr;
    newObj.title = obj.title;
    newObj.link = obj.link;
    newObj.alt = obj.alt;
    newObj.category = obj.category;
    newObj.id = obj.id;
    newObj.dateArticle = obj.dateArticle;

    acc.push(newObj);
    return acc;
  }, []);

  //------- рендерим разметку по отсортированным уникальным датам---------
  spinner.spin(spinnerContainer);

  for (let date of uniqueDates) {
    // --------------рендер заголовка с датой прочтения новостей-----------------
    const cardMarkupLi = `<li>
            <div class="date-wrap">
                <p class="cards-date">${date}
                   <svg class="arrow-read" width="15" height="9" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M1.762 9 0 7.287 7.5 0 15 7.287 13.238 9 7.5 3.437 1.763 9Z" fill=""/>
                   </svg>
                   <svg class="arrow-read visually-hidden" width="15" height="9" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M1.762 0 0 1.713 7.5 9 15 1.713 13.238 0 7.5 5.563 1.763 0Z" fill=""/>
                   </svg>
                </p>
                <div class="clicker"></div>
            </div>
            <div class="news-item">
                <div class="news-wrap">`;

    // ---------------рендер карточек новостей согласно прочитанной дате в заголовке---------

    const cardMarkupDiv = arrayConverDates
      .filter(obj => obj.date === date)
      .map(obj => {
        return `<div class="news-card" news-id="${obj.id}">
      <div class="news-card__img">
        <p class="news-card__theme">${obj.category}</p>
        <img
          class="news-card__item"
          src="${obj.img}"
          alt="${obj.alt ? obj.alt : 'photo'}"
          loading="lazy"
          width="395"
        />
        <div class="news-card__favorite">
        <button id ='${
          obj.id
        }' class="mybtn label-favorite">Add to favorite</button>
        </div>
      </div>
      <h2 class="news-card__info-title">${obj.title.limit(50, {
        ending: '',
      })}</h2>
      <p class="news-card__info-text">${obj.descr.limit(120)}</p>
      <div class="news-card__additional">
        <p class="news-card__date">${obj.dateArticle}</p>
        <a class="news-card__more" href="${obj.link}" id="${
          obj.id
        }" target="_blank" rel="noreferrer noopener">Read more</a>
      </div>
    </div>`;
      });
    cardMarkup += cardMarkupLi + cardMarkupDiv.join('') + '</div></div></li>';
  }
  cardList.innerHTML = cardMarkup;

  spinner.stop();

  // --проставляю всем контейнерам с новостями высоту по занимаемому контенту-------------------------

  document
    .querySelectorAll('.news-item')
    .forEach(el => (el.style.maxHeight = el.scrollHeight + 'px'));

  // --делаю выпадающий список с новостями по датам - accordion-------------------
  document.querySelectorAll('.cards-date').forEach(el =>
    el.addEventListener('click', () => {
      const svg = el.children;
      for (let itemsvg of svg) itemsvg.classList.toggle('visually-hidden');

      const newsItem = el.parentNode.nextElementSibling;
      if (newsItem.style.maxHeight !== '0px') newsItem.style.maxHeight = '0px';
      else newsItem.style.maxHeight = newsItem.scrollHeight + 'px';
    })
  );
}

// ---замена дат в хранилище "read more" на случайные---

// const clicker = document.querySelector('.clicker');
// clicker.addEventListener('click', onClick);

// function getRandomIntInclusive(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function onClick() {
//   try {
//     const unparsed = localStorage.getItem('read more');
//     const parsed = JSON.parse(unparsed);

//     if (parsed === null) return;
//     else if (parsed.length === 0)
//       Report.info('There are no news You have read');
//     else {
//       const arrayChangedDates = parsed.reduce((acc, obj) => {
//         const newObj = {};
//         const i = getRandomIntInclusive(1, 9) * 86400000;

//         newObj.date = obj.date - i;
//         newObj.img = obj.img;
//         newObj.descr = obj.descr;
//         newObj.title = obj.title;
//         newObj.link = obj.link;
//         newObj.alt = obj.alt;
//         newObj.category = obj.category;
//         newObj.id = obj.id;
//         newObj.dateArticle = obj.dateArticle;
//         acc.push(newObj);
//         // i += 1;
//         return acc;
//       }, []);

//       renderMarkup(arrayChangedDates);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }

addClassesForCoincidencesMarkupAndStoragePages();
