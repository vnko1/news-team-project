import { fetchNews } from './FetchNews';
// const submitBtn = document.getElementById('queryBtn');
const inputField = document.querySelector('.search-input');
const form = document.getElementById('search-form');
// const gallery = document.querySelector('.gallery-container');
const gallery = document.querySelector('.gallery >.container');

// console.log(gallery);

// const newsCards = document.querySelectorAll('.news-card');

form.addEventListener('submit', onFormSubmit);

fetchNews.resetData();

async function onFormSubmit(event) {
  deleteCards();
  fetchNews.resetData();
  try {
    event.preventDefault();

    const query = inputField.value;
    // console.log(query);

    fetchNews.setQuerySearch(query);

    const response = await fetchNews.fetchNewsBySearch();

    if (!response.docs.length) {
      gallery.innerHTML = `
      <div>
      <p>We haven’t found news from this category</p>
      <img src='https://klike.net/uploads/posts/2020-09/1599896421_21.jpg'>
      </div>
      `;
      console.log('нічого не знайдено');
      return;
    }

    // console.log(response.docs);
    fetchNews.setHits(response.meta.hits);
    // console.log(fetchNews.getHits());
    const { docs } = response;

    docs.forEach(article => {
      //обрізаємо опис якщо більше 200 символів
      const infoText = fetchNews.cutInfo(article.lead_paragraph);
      //   console.log(infoText);
      //приводимо дату до потрібного формату
      const date = fetchNews.formatDate(article.pub_date);

      const multimedia = article.multimedia.find(
        media => media.subtype === 'xlarge'
      );

      const img = `https://www.nytimes.com/${multimedia.url}`;

      //   console.log(img);

      const obj = {
        title: article.headline.main,
        description: infoText,
        category: article.section_name,
        pubDate: date,
        url: article.web_url,
        img,
        imgDescr: article.keywords[0].value,
        id: article._id,
      };
      pushData(obj);
      //   console.log(obj);
    });

    //очищаємо картки

    renderCards();
    fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
  } catch (error) {
    console.log;
  }
  form.reset();
  //   console.log(fetchNews.getData());
}

//очищаємо картки
function deleteCards() {
  gallery.innerHTML = '';
}

function pushData(data) {
  fetchNews.addData(fetchNews.createObj(data));
}

function renderCards() {
  const data = [];

  const fetchData = fetchNews.getData();
  //проходимося по отриманим даним (масив з 10 елементів) та вибираємо 8 з них для нашого рендеру
  for (let i = 0; i < fetchData.length; i++) {
    if (i >= 8) break;
    data.push(fetchData[i]);
  }
  const markUp = data.reduce((acc, el) => {
    acc += `
<div class="news-card" news-id="${el.id}">
    <div class="news-card__img">
      <p class="news-card__theme">${el.category}</p>
      <img class="news-card__item"
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
      <p class="news-card__info-text">${el.description}</p>
      <div class="news-card__additional">
        <p class="news-card__date">${el.pubDate}</p>
        <a class="news-card__more" href="${
          el.url
        }" target='_blanc'>Read more</a>
      </div>
    </div>`;
    return acc;
  }, ``);

  gallery.insertAdjacentHTML('beforeend', markUp);
}
