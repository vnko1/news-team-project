import { fetchNews } from './FetchNews';
const gallery = document.querySelector('.gallery-container');

String.prototype.limit = function (limit, userParams) {
  let text = this,
    options = {
      ending: '...',
      trim: true,
      words: true,
    },
    prop,
    lastSpace,
    processed = false;

  if (limit !== parseInt(limit) || limit <= 0) return this;

  // применить userParams
  if (typeof userParams == 'object') {
    for (prop in userParams) {
      if (userParams.hasOwnProperty.call(userParams, prop)) {
        options[prop] = userParams[prop];
      }
    }
  }
  if (options.trim) text = text.trim();

  if (text.length <= limit) return text; // по длине вписываемся и так
  text = text.slice(0, limit); // тупо отрезать по лимиту
  lastSpace = text.lastIndexOf(' ');
  if (options.words && lastSpace > 0) {
    text = text.substr(0, lastSpace);
  }
  return text + options.ending;
};

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
  urlCategory = '',
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
    urlCategory,
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
  // додоємо створену розмітку в DOM
  gallery.insertAdjacentHTML('beforeend', markUp);
}
function deleteNewsCards() {
  // видаляє повністю розмітку і  календар також (тимчасовий код)
  // gallery.innerHTML = '';
  // видаляє тільки newsCards, погода щзалишається, але працюватиме тільки, якщо при завантаженні сторінки вже рендер карток новин
  const newsCards = fetchNews.getNodeChild();
  newsCards.forEach(el => el.remove());
}

function saveCategoryData(data) {
  let img = null;
  let imgDescr = null;
  // console.log(!data[148].multimedia);

  data.forEach(el => {
    if (el.multimedia) {
      el.multimedia.forEach(e => {
        if (e.format.includes('440')) {
          img = e.url;
          imgDescr = e.caption;
        }
      });
    }

    const pubDate = formatDate(el.published_date);
    const obj = {
      title: el.title,
      description: el.abstract,
      category: el.section,
      pubDate,
      url: el.url,
      img,
      imgDescr,
      id: el.uri,
    };

    pushData(obj);
    fetchNews.addCategoryData(createObj(obj));
  });
}

function savePopularData(data) {
  let img = null;

  data.forEach(element => {
    const media = element.media;
    media.forEach(e => {
      img = e['media-metadata'][2].url;
    });

    const pubDate = element.published_date.split('-').reverse().join('/');

    const obj = {
      title: element.title,
      description: element.abstract,
      category: element.section,
      pubDate,
      url: element.url,
      img,
      imgDescr: element.nytdsection,
      id: element.id,
    };
    pushData(obj);
  });
}

function saveSearchData(data) {
  let img = null;

  data.forEach(element => {
    element.multimedia.forEach(e => {
      if (e.subType === 'xlarge') {
        img = `https://www.nytimes.com/${e.url}`;
      }
    });

    const pubDate = formatDate(element.pub_date);

    const imgDescr = element.keywords[0]?.value
      ? element.keywords[0].value
      : '';

    const obj = {
      title: element.headline.main,
      description: element.lead_paragraph,
      category: element.section_name,
      pubDate,
      url: element.web_url,
      img,
      imgDescr,
      id: element._id,
    };
    pushData(obj);
  });
}

function pushData(data) {
  fetchNews.addData(createObj(data));
  fetchNews.addStorageData(createObj(data));
}

//приводимо дату до потрібного формату
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0'); // додаємо нуль, якщо число менше 10
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // додаємо нуль, якщо місяць менше 10
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

//обрізаємо опис якщо більше 180 символів
function cutInfo(text) {
  return text.length <= 180 ? text : text.slice(0, 180) + '...';
}

// Вставить функцию в блок then(), после функции которая рендерит разметку!!!
function addClassesForCoincidencesMarkupAndStorage() {
  const favouriteList = getStorageList('favourites');
  const labelsEl = document.querySelectorAll('.label-favorite');
  const newArrOfBtn = [...labelsEl];

  newArrOfBtn.filter(obj => {
    for (const objOfFavourite of favouriteList) {
      if (obj.id === objOfFavourite.id) {
        obj.className = 'label-favorite js-favourite-storage';
        obj.parentNode.lastElementChild.checked = true;
      }
    }
  });
  //-----------------------------------------
  const readMoreList = getStorageList('read more');

  const linkEl = document.querySelectorAll('.news-card__more');

  const newArrOfLinks = [...linkEl];

  newArrOfLinks.filter(obj => {
    for (const objOfFavourite of readMoreList) {
      if (obj.id === objOfFavourite.id) {
        obj.className = 'news-card__more js-read-more-storage';
      }
    }
  });
}

// Взять данные с ЛОКАЛСТОРИДЖ
function getStorageList(valueOfKeyStorage) {
  return JSON.parse(localStorage.getItem(valueOfKeyStorage));
}

export {
  cutInfo,
  formatDate,
  createObj,
  renderNewsCards,
  deleteNewsCards,
  saveCategoryData,
  savePopularData,
  saveSearchData,
  getStorageList,
  addClassesForCoincidencesMarkupAndStorage,
};
