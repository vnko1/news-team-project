import VanillaCalendar from '@uvarov.frontend/vanilla-calendar';
import { fetchNews } from './fetchNews';

const calendar = new VanillaCalendar('#calendar');
calendar.init();
// const fetchNews = new FetchNews();
let date = null;
const calendarContainer = document.querySelector('#calendar');
calendarContainer.addEventListener('click', onDateClick);

async function onDateClick(e) {
  if (e.target.hasAttribute('data-calendar-day')) {
    fetchNews.setDate(
      e.target.getAttribute('data-calendar-day').split('-').join('')
    );
    console.log(fetchNews.getDate());
    const response = await fetchNews.fetchNews();
    if (!response.docs.length) {
      console.log('нічого не знайдено');
      return;
    }
    console.log(response.docs);
  }
}
