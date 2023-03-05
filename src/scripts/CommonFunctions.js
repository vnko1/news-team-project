import { fetchNews } from './fetchNews';

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

function saveCategoryData(data) {
  console.log(data);
  let img = null;
  let imgDescr = null;
  data.forEach(el => {
    // console.log(el);
    el.multimedia.forEach(e => {
      if (e.format.includes('440')) {
        img = e.url;
        imgDescr = e.caption;
      }
    });

    const pubDate = new Date(el.published_date)
      .toLocaleString()
      .split(',')
      .splice(0, 1)
      .join('')
      .replaceAll('.', '/');

    const obj = {
      title: el.title,
      description: el.abstract,
      category: el.section,
      pubDate,
      url: el.url,
      img,
      imgDescr,
      id: el.uri,
      urlCategory: fetchNews.getFilterParams(),
    };
    pushData(obj);
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
      urlCategory: fetchNews.getFilterParams(),
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

    const pubDate = new Date(element.pub_date)
      .toLocaleString()
      .split(',')
      .splice(0, 1)
      .join('')
      .replaceAll('.', '/');

    imgDescr = element.keywords[0]?.value ? element.keywords[0].value : '';
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

export {
  createObj,
  renderNewsCards,
  deleteNewsCards,
  saveCategoryData,
  savePopularData,
  saveSearchData,
};
