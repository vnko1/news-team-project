import VanillaCalendar from '@uvarov.frontend/vanilla-calendar';
import { fetchNews } from './fetchNews';

const calendar = new VanillaCalendar('#calendar');
calendar.init();

const inputEl = document.querySelector('#date');
const calendarContainer = document.querySelector('#calendar-container');
const calendarEl = document.querySelector('#calendar');
const gallery = document.querySelector('.gallery-container');

const dateContainer = document.querySelector('.date-container');
// let galleryList = null;

inputEl.addEventListener('click', onInputElClick);
calendarEl.addEventListener('click', onDateClick);

function onInputElClick() {
  calendarContainer.classList.remove('is-hidden');
  document.addEventListener('click', onWindowClick);
}

function onWindowClick(e) {
  const withinBoundaries = e.composedPath().includes(dateContainer);

  if (!withinBoundaries) {
    calendarContainer.classList.add('is-hidden');
    document.removeEventListener('click', onWindowClick);
  }
}

async function onDateClick(e) {
  if (e.target.hasAttribute('data-calendar-day')) {
    const date = e.target.getAttribute('data-calendar-day');
    console.log(date);

    fetchNews.setDate(date.split('-').join(''));
    inputEl.value = date.split('-').reverse().join('/');
    calendarContainer.classList.add('is-hidden');
    fetchNews.resetData();

    try {
      const response = await fetchNews.fetchNewsByData();

      if (!response.docs.length) {
        console.log('нічого не знайдено');
        return;
      }

      fetchNews.setHits(response.meta.hits);

      const { docs } = response;

      normalizeData(docs);

      deleteNewsCards();
      renderNewsCards();
    } catch (error) {
      console.log(error);
    }
  }
}

function normalizeData(data) {
  let img = null;

  data.forEach(element => {
    element.multimedia.forEach(e => {
      if (e.subType === 'xlarge') {
        img = e.url;
      }
    });

    const pubDate = new Date(element.pub_date)
      .toLocaleString()
      .split(',')
      .splice(0, 1)
      .join('')
      .replaceAll('.', '/');
    imgDescr = element.keywords[0]?.value ? element.keywords[0].value : '';

    pushData(
      element.headline.main,
      element.lead_paragraph,
      element.section_name,
      pubDate,
      element.web_url,
      img,
      imgDescr,
      element._id
    );
  });
}

function pushData(
  title,
  description,
  category,
  pubDate,
  url,
  img,
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
      img,
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
      img,
      imgDescr,
      id
    )
  );
}

function deleteNewsCards() {
  const galleryChild = gallery.children;
  console.log(object);
  for (let i = 0; i < galleryChild.length; i++) {
    console.log(galleryChild[i]);
  }

  gallery.innerHTML = '';

  // galleryList.forEach(el => (el.innerHTML = ''));
}

function renderNewsCards() {
  const data = [];
  const fetchData = fetchNews.getData();
  console.log(fetchData);
  for (let i = 0; i < fetchData.length; i++) {
    if (i >= 8) break;
    data.push(fetchData[i]);
  }

  const markUp = data.reduce((acc, el) => {
    acc += `<div class="news-card" news-id="${el.id}">
      <div class="news-card__img">
        <p class="news-card__theme">${el.category}</p>
        <img
          class="news-card__item"
          src="${el.img}"
          alt="${el.imgDescr ? el.imgDescr : 'photo'}"
          loading="lazy"
          width="395"
        />
        <div class="news-card__favorite">
          <label for="favorite" class="label-favorite">Add to favorite</label>
          <input type="checkbox" class="input-favorite" id="favorite" />
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
        <a class="news-card__more" href="${el.url}">Read more</a>
      </div>
    </div>`;
    return acc;
  }, ``);
  gallery.insertAdjacentHTML('beforeend', markUp);
}
