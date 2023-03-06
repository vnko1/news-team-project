import { fetchNews } from './fetchNews';

const gallery = document.querySelector('.gallery-container');

onLoad();

async function onLoad() {
  const response = await fetchNews.fetchNewsByPopular();
  const { results } = response;

  normalizeData(results);

  renderNewsCards();
  fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
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
    fetchNews.createObj({
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

function renderNewsCards() {
  const data = [];
  const fetchData = fetchNews.getData();

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
          src="${el.imgUrl}"
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
