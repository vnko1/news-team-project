import VanillaCalendar from '@uvarov.frontend/vanilla-calendar';
import { fetchNews } from './fetchNews';

const calendar = new VanillaCalendar('#calendar');
calendar.init();

const inputEl = document.querySelector('#date');
const calendarContainer = document.querySelector('#calendar-container');
const calendarEl = document.querySelector('#calendar');
const gallery = document.querySelector('.gallery-container');
const galleryList = document.querySelectorAll('.gallery-container .news-card');

inputEl.addEventListener('click', onInputElClick);
calendarEl.addEventListener('click', onDateClick);

function onInputElClick() {
  calendarContainer.classList.remove('is-hidden');
  // window.addEventListener('click', onWindowClick);
}

function onWindowClick(e) {
  if (e.target !== inputEl) {
    calendarContainer.classList.add('is-hidden');
    window.removeEventListener('click', onWindowClick);
  }
}

async function onDateClick(e) {
  if (e.target.hasAttribute('data-calendar-day')) {
    const date = e.target.getAttribute('data-calendar-day');

    fetchNews.setDate(date.split('-').join(''));
    inputEl.value = date.split('-').reverse().join('/');
    calendarContainer.classList.add('is-hidden');

    try {
      const response = await fetchNews.fetchNewsByData();
      console.log(response);

      if (!response.docs.length) {
        console.log('нічого не знайдено');
        return;
      }

      fetchNews.setHits(response.meta.hits);

      const { docs } = response;

      let img = null;

      docs.forEach(element => {
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

        fetchNews.addData(
          fetchNews.createObj(
            element.headline.main,
            element.lead_paragraph,
            element.section_name,
            pubDate,
            element.web_url,
            img,
            element._id
          )
        );
      });

      deleteNewsCards();
      rendeNewsCards();
    } catch (error) {
      console.log(error);
    }
  }
}

function deleteNewsCards() {
  galleryList.forEach(el => (el.innerHTML = ''));
}

function rendeNewsCards() {
  const data = [];
  const fetchData = fetchNews.getData();
  for (let i = 0; i < fetchData.length; i++) {
    if (i >= 8) break;
    data.push(fetchData[i]);
  }
  console.log(data);
  const markUp = data.reduce((acc, el) => {
    acc += `<div class="news-card">
      <div class="news-card__img">
        <p class="news-card__theme">${el.category}</p>
        <img
          class="news-card__item"
          src="https://www.nytimes.com/${el.imgUrl}"
          alt=""
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
        el.description.length > 200
          ? el.description.slice(0, 200) + '...'
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
