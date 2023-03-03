const form = document.getElementById('read-search-form');
const search = document.getElementById('read-input');
const cardList = document.getElementById('ul-gallery');
const parseBtn = document.getElementById('parseBtn');
let articles = [];
const article = {
  readDate: '',
  imgurl: '',
  headline: '',
  snippet: '',
  weburl: '',
};

form.addEventListener('submit', onSubmit);
window.addEventListener('click', onClick);
parseBtn.addEventListener('click', onParse);

function onSubmit(e) {
  const API_KEY = '6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';
  const querySearch = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${search.value}&api-key=${API_KEY}`;

  e.preventDefault();

  fetch(querySearch)
    .then(response => response.json())
    .then(data => {
      let i = 1;
      for (let a of data.response.docs) {
        const obj = {};

        const date = new Date();
        let convertDate = '';
        if (i % 2 === 0)
          convertDate = `${String(date.getDate()).padStart(2, 0)}/${String(
            date.getMonth() + 1
          ).padStart(2, 0)}/${String(date.getFullYear())}`;
        else
          convertDate = `${String(date.getDate() - 1).padStart(2, 0)}/${String(
            date.getMonth() + 1
          ).padStart(2, 0)}/${String(date.getFullYear())}`;

        obj.readDate = convertDate;
        obj.imgurl = a.multimedia[0].url;
        obj.headline = a.headline.main;
        obj.snippet = a.snippet;
        obj.weburl = a.web_url;
        articles.push(obj);

        i += 1;
      }
      console.log('получился массив статей    ', articles);

      try {
        localStorage.setItem('have read', JSON.stringify(articles));
      } catch (err) {
        console.error(err);
      }
    });
}

function onParse() {
  try {
    const unparsed = localStorage.getItem('have read');
    const parsed = JSON.parse(unparsed);
    if (parsed !== null) {
      renderMarkup(parsed);
    }
  } catch (err) {
    console.error(err);
  }
}

function renderMarkup(array) {
  let cardMarkup = '';
  const uniqueDates = array
    .flatMap(obj => obj.readDate)
        .filter((course, index, array) => array.indexOf(course) === index);
    
    for (let date of uniqueDates) {
      
    const cardMarkupLi = `<li class="cards">
            <h2 class="cards-date">${date}
            <svg class="arrow arrow-up" width="9" height="15">
                  <use href="/src/images/sprite.svg#icon-arrow-up"></use>
                </svg>
                <svg class="arrow arrow-down" width="9" height="15">
                  <use href="/src/images/sprite.svg#icon-arrow-up"></use>
                </svg>
                </h2>
                `;
    const cardMarkupDiv = array
      .filter(obj => obj.readDate === date)
      .map(obj => {
          const src = `https://www.nytimes.com/${obj.imgurl}`;
        return `<div class="card">
                      <img src="${src}" alt="" />
                      <h3>${obj.headline}</h3>
                      <p class="info-item">${obj.snippet}</p>
                      <p class="info-item">${obj.weburl}</p>
            </div>`;
      });
    cardMarkup += cardMarkupLi + cardMarkupDiv.join('') + '</li>';
  }
  cardList.innerHTML = cardMarkup;
}

function onClick(e) {
  console.log(e.target.tagName);
  console.log(e.target.children);
  if (e.target.tagName === 'H2') {
    let cont = e.target.parentNode.querySelectorAll('div');

    for (let item of cont) item.classList.toggle('hidden');

    console.log(cont);
  }
}
