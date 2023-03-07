import { fetchNews } from './FetchNews';
import { spinner } from './Libraries';
import {
  renderNewsCards,
  savePopularData,
  addClassesForCoincidencesMarkupAndStorage,
} from './CommonFunctions';

onLoad();

async function onLoad() {
  spinner.spin(document.body);
  try {
    const response = await fetchNews.fetchNewsByPopular();
    fetchNews.setHits(response.data.num_results);
    fetchNews.setFilterParams('popular');
    savePopularData(response.data.results);
    renderNewsCards();
    fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
    fetchNews.setIsUrlRequest(true);
    addClassesForCoincidencesMarkupAndStorage();
  } catch (error) {
    console.log(error);
    spinner.stop();
  }
  spinner.stop();
}
