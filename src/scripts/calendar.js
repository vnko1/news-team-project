import VanillaCalendar from '@uvarov.frontend/vanilla-calendar';
import { fetchNews } from './fetchNews';

const calendar = new VanillaCalendar('#calendar');
calendar.init();

const inputEl = document.querySelector('#date');
const calendarContainer = document.querySelector('#calendar-container');
const calendarEl = document.querySelector('#calendar');

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

    const response = await fetchNews.fetchNewsByData();
    console.log(response);
    fetchNews.setHits(response.meta.hits);

    const { docs } = response;

    docs.forEach(element => {
      const img = element.multimedia.forEach(e => {
        if (e.subType === 'xlarge') {
          return e.url;
        }
      });
      fetchNews.addData(
        fetchNews.createObj(
          element.headline.main,
          element.lead_paragraph,
          element.section_name,
          element.pub_date,
          element.web_url,
          img,
          element._id
        )
      );
    });

    if (!response.docs.length) {
      console.log('нічого не знайдено');
      return;
    }
  }
}
