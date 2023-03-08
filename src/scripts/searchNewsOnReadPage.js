import { fetchNews } from './fetchNews';
import {
  cutInfo,
  createObj,
  formatDate,
  addClassesForCoincidencesMarkupAndStorage,
  showNotFoundMessage,
  hideNotFoundMessage,
} from './commonFunctions';

import { spinner } from './libraries';
import { Report } from 'notiflix/build/notiflix-report-aio'; //бібліотека сповіщень
import { addClassesForCoincidencesMarkupAndStoragePages } from './commonFunctions';

const inputField = document.querySelector('.search-input');
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery-container');

form.addEventListener('submit', onFormSubmit);

//сабмітимо форму
async function onFormSubmit(event) {
  //очищуємо масив даних

  event.preventDefault();

  fetchNews.resetData();
  fetchNews.resetStorageData();
  spinner.spin(document.body);

  try {
    //присвоюємо запиту значення інпуту
    const query = inputField.value;
    //якщо нічого не ввели в інпут

    if (!query) {
      Report.failure('Please enter a search term.');
      spinner.stop();
      return;
    }

    // приcвоює нове значення пошуковуму параметру
    fetchNews.setQuerySearch(query);

    //робимо запит
    const response = await fetchNews.fetchNewsBySearch();

    //якщо нічого не приходить у відповіть то пушимо у розмітку <div>
    if (!response.docs.length) {
      deleteCards();
      showNotFoundMessage();
      form.reset();
      spinner.stop();
      return;
    }
    hideNotFoundMessage();
    //пушимо в екземпляр класу загальну кількість даних яки прийшли у відповідб
    fetchNews.setHits(response.meta.hits);
    const { docs } = response;
    saveData(docs);
    //очищаємо картки
    deleteCards();
    renderCards();
    //пушимо розмітку

    spinner.stop();
    addClassesForCoincidencesMarkupAndStorage();
    // записує масив елементів

    fetchNews.setIsUrlRequest(true);
  } catch (error) {
    spinner.stop();
  }

  //скидаємо форму
  form.reset();
}

//очищаємо картки
function deleteCards() {
  gallery.innerHTML = '';
}

//пушимо дані в екземпляр класу
function pushData(data) {
  fetchNews.addData(createObj(data));
  fetchNews.addStorageData(createObj(data));
}
//приводимо отримані дані до потрібного нам формату
function saveData(data) {
  let img = null;
  data.forEach(article => {
    // шукаємо картинку
    article.multimedia.forEach(media => {
      if (media.subType === 'xlarge') {
        img = `https://www.nytimes.com/${media.url}`;
      }
    });
    //обрізаємо опис якщо більше 180 символів
    const infoText = cutInfo(article.lead_paragraph);
    //приводимо дату до потрібного формату
    const date = formatDate(article.pub_date);

    const obj = {
      title: article.headline.main,
      description: infoText,
      category: article.section_name,
      pubDate: date,
      url: article.web_url,
      img,
      imgDescr: article.keywords[0]?.value ? article.keywords[0].value : '', //
      id: article._id,
    };

    pushData(obj);
  });
}
//робимо розмітку
function renderCards() {
  const data = [];

  const fetchData = fetchNews.getData();

  //проходимося по отриманим даним (масив з 10 елементів) та вибираємо 8 з них для нашого рендеру
  for (let i = 0; i < fetchData.length; i++) {
    if (i >= 8) break;

    data.push(fetchData[i]);
  }
  const markUp = data.reduce((acc, el) => {
    acc += `
<div class="news-card" news-id="${el.id}">
    <div class="news-card__img">
      <p class="news-card__theme">${el.category}</p>
      <img class="news-card__item"
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

  // пушимо розмітку на сторінку
  gallery.insertAdjacentHTML('beforeend', markUp);
  gallery.classList.add('gallery-container-search');
}

addClassesForCoincidencesMarkupAndStoragePages();
