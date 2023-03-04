import VanillaCalendar from '@uvarov.frontend/vanilla-calendar';
import { spinner } from './Spinner';
import { fetchNews } from './fetchNews';
import { createObj, renderNewsCards, deleteNewsCards } from './CommonFunctions';

const calendar = new VanillaCalendar('#calendar');
calendar.init();

const inputEl = document.querySelector('#date');
const calendarContainer = document.querySelector('#calendar-container');
const calendarEl = document.querySelector('#calendar');
// const gallery = document.querySelector('.gallery-container');
const dateContainer = document.querySelector('.date-container');

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
    const unixDate = new Date();
    const selectedDate = new Date(date);

    if (selectedDate.getTime() > unixDate.getTime()) {
      console.log('введіть сьоднішню дату');
      return;
    }
    deleteNewsCards();
    fetchNews.setDate(date.split('-').join(''));
    inputEl.value = date.split('-').reverse().join('/');
    calendarContainer.classList.add('is-hidden');
    fetchNews.resetData();
    console.log(fetchNews.getUrl());
    spinner.spin(document.body);
    try {
      const response = await fetchNews.fetchNewsByDate();

      if (!response.docs.length) {
        console.log('нічого не знайдено');
        return;
      }

      fetchNews.setHits(response.meta.hits);

      const { docs } = response;

      saveData(docs);

      renderNewsCards();
      spinner.stop();
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
    } catch (error) {
      console.log(error);
    }
  }
}

function saveData(data) {
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
}
