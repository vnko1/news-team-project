import { fetchNews } from './FetchNews';
import { spinner } from './Libraries';
import { createObj, renderNewsCards } from './CommonFunctions';

// const gallery = document.querySelector('.gallery-container');

onLoad();

async function onLoad() {
  const response = await fetchNews.fetchNewsByPopular();
  // console.log(response.data.results);
  normalizeData(response.data.results);

  renderNewsCards();
  spinner.spin(document.body);
  // fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
}

function normalizeData(data) {
  let img = null;
  const imageDescr = 'alt';
  data.forEach(element => {
    const media = element.media;
    media.forEach(e => {
      img = e['media-metadata'][2].url;
    });

    const pubDate = element.published_date.split('-').reverse().join('/');
    // console.log(element);

    // imgDescr = element.keywords[0]?.value ? element.keywords[0].value : '';

    pushData(
      element.title,
      element.abstract,
      element.section,
      pubDate,
      element.url,
      img,
      imageDescr,
      element.id
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
    createObj({
      title,
      description,
      category,
      pubDate,
      url,
      img,
      imgDescr,
      id,
    })
  );
}
