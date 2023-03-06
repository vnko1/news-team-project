import { fetchNews } from './FetchNews';
import {
  saveSearchData,
  addClassesForCoincidencesMarkupAndStorage,
  renderNewsCards,
  deleteNewsCards,
} from './CommonFunctions';

const btn = document.querySelector('.pagination');
btn.addEventListener('click', onHandlePaginationClick);

async function onHandlePaginationClick() {
  fetchNews.incrementPage();
  deleteNewsCards();
  if (fetchNews.getUrl().includes('articlesearch')) {
    fetchNews.resetData();
    fetchNews.resetStorageData();
    try {
      const response = await fetchNews.fetchPagination();
      if (!response.data.response.docs.length) {
        console.log('закінчились новини');
        return;
      }
      const {
        data: {
          response: { docs },
        },
      } = response;

      saveSearchData(docs);
      renderNewsCards();

      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(true);
      addClassesForCoincidencesMarkupAndStorage();
    } catch (error) {
      console.log(error);
    }
  }
}
