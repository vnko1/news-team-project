import { fetchNews } from './FetchNews';
import {
  cutInfo,
  createObj,
  formatDate,
  addClassesForCoincidencesMarkupAndStorage,
} from './CommonFunctions';
import { spinner } from './Libraries';
import { Report } from 'notiflix/build/notiflix-report-aio'; //бібліотека сповіщень

const inputField = document.querySelector('.search-input');
const form = document.getElementById('search-form');
// const gallery = document.querySelector('.gallery-container');
const gallery = document.querySelector('.gallery >.container');

// console.log(gallery);

form.addEventListener('submit', onFormSubmit);

//сабмітимо форму
async function onFormSubmit(event) {
  //очищуємо масив даних
  event.preventDefault();
  fetchNews.resetData();

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
    // console.log(query);
    // приcвоює нове значення пошуковуму параметру
    fetchNews.setQuerySearch(query);

    //робимо запит
    const response = await fetchNews.fetchNewsBySearch();

    //якщо нічого не приходить у відповіть то пушимо у розмітку <div>
    if (!response.docs.length) {
      gallery.innerHTML = `
      <div>
      <p>We haven’t found news from this category</p>
      <img src='https://klike.net/uploads/posts/2020-09/1599896421_21.jpg'>
      </div>
      `;

      // console.log('нічого не знайдено');
      form.reset();
      spinner.stop();
      return;
    }

    // console.log(response.docs);
    //пушимо в екземпляр класу загальну кількість даних яки прийшли у відповідб
    fetchNews.setHits(response.meta.hits);
    // console.log(fetchNews.getHits());

    const { docs } = response;

    saveData(docs);

    //очищаємо картки
    deleteCards();

    //пушимо розмітку
    renderCards();
    spinner.stop();
    addClassesForCoincidencesMarkupAndStorage();
    // записує масив елементів
    fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
    fetchNews.setIsUrlRequest(true);
    // !!! ----------------> Сюди буде додана логіка localstorage
  } catch (error) {
    console.log;
  }

  //скидаємо форму
  form.reset();

  // console.log(fetchNews.getData());
}

//очищаємо картки
function deleteCards() {
  // gallery.innerHTML = '';
  const newsCards = fetchNews.getNodeChild();
  newsCards.forEach(el => el.remove());
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

    // console.log(img);

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
  // console.log(data);
  const fetchData = fetchNews.getData();

  //проходимося по отриманим даним (масив з 10 елементів) та вибираємо 8 з них для нашого рендеру
  for (let i = 0; i < fetchData.length; i++) {
    if (i >= 8) break;
    // console.log(i);
    data.push(fetchData[i]);
  }
  // console.log(data);
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
        <label for="favorite" class="label-favorite" id="${
          el.id
        }">Add to favorite</label>
          <input type="checkbox" class="input-favorite" id="favorite" />
        </div>
      </div>
      <h2 class="news-card__info-title">${el.title}</h2>
      <p class="news-card__info-text">${el.description}</p>
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
}