const form = document.getElementById('read-search-form');
const search = document.getElementById('read-input');
const cardList = document.getElementById('ul-gallery');
const parseBtn = document.getElementById('parseBtn');
let articles = [];

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

        if (i % 2 === 0) obj.readDate = date.getTime();
        else if (i % 3 === 0) obj.readDate = date.getTime() - 180000000;
        else obj.readDate = date.getTime() - 360000000;

        console.log(obj.readDate);
        console.log(i);
        obj.imgurl = a.multimedia[0].url;
        obj.headline = a.headline.main;
        obj.snippet = a.snippet;
        obj.weburl = a.web_url;
        obj.pubdate = a.pub_date;
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

  // -------сортируем даты по убыванию и выделяем уникальные даты---------

  const initialDates = array.map(obj => obj.readDate);
  const descendingDates = [...initialDates]
    .sort((a, b) => b - a)
    .map(dateUnix => {
      const dateStamp = new Date(dateUnix);

      return `${String(dateStamp.getDate()).padStart(2, 0)}/${String(
        dateStamp.getMonth() + 1
      ).padStart(2, 0)}/${String(dateStamp.getFullYear())}`;
    });
  const uniqueDates = descendingDates.filter(
    (course, index, array) => array.indexOf(course) === index
  );

  //------- создаем массив объектов с датой в формате day/month/year---------

  const arrayConverDates = array.reduce((acc, obj) => {
    const newObj = {};
    const dateStamp = new Date(obj.readDate);
    const pubDateStamp = new Date(obj.pubdate);

    newObj.readDate = `${String(dateStamp.getDate()).padStart(2, 0)}/${String(
      dateStamp.getMonth() + 1
    ).padStart(2, 0)}/${String(dateStamp.getFullYear())}`;
    newObj.imgurl = obj.imgurl;
    newObj.headline = obj.headline;
    newObj.snippet = obj.snippet;
    newObj.weburl = obj.weburl;
    newObj.pubdate = `${String(pubDateStamp.getDate()).padStart(2, 0)}/${String(
      pubDateStamp.getMonth() + 1
    ).padStart(2, 0)}/${String(pubDateStamp.getFullYear())}`;
    acc.push(newObj);
    return acc;
  }, []);

  //------- рендерим разметку по отсортированным уникальным датам---------

  for (let date of uniqueDates) {
    const cardMarkupLi = `<li>
            <h2 class="cards-date">${date}
            <svg class="arrow-up" width="15" height="9" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M1.762 9 0 7.287 7.5 0 15 7.287 13.238 9 7.5 3.437 1.763 9Z" fill="#111321"/>
            </svg>
            <svg class="arrow-down visually-hidden" width="15" height="9" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M1.762 0 0 1.713 7.5 9 15 1.713 13.238 0 7.5 5.563 1.763 0Z" fill="#111321"/>
            </svg>
            </h2>
            <div class="date-wrap">`;
    const cardMarkupDiv = arrayConverDates
      .filter(obj => obj.readDate === date)
      .map(obj => {
        const src = `https://www.nytimes.com/${obj.imgurl}`;
        return `<div class="news-card">
                      <div class="news-card__img">
                           <p class="news-card__theme">news theme</p>
                           <img class="news-card__item" src="${src}" alt="" loading="lazy" width="395" />
                           <div class="news-card__favorite">
                                <label for="favorite" class="label-favorite">Add to favorite</label>
                                <input type="checkbox" class="input-favorite" id="favorite">
                           </div>
                      </div>
                      <h2 class="news-card__info-title">${obj.headline}</h2>
                      <p class="news-card__info-text">${obj.snippet}</p>
                      <div class="news-card__additional">
                          <p class="news-card__date">${obj.pubdate}</p>
                          <a class="news-card__more" href="${obj.weburl}" target="_blank" rel="noreferrer noopener">Read more</a>
                      </div>
                 </div>`;
        
        
        
        // `<div class="card">
        //               <img src="${src}" alt="" />
        //               <h3>${obj.headline}</h3>
        //               <p class="info-item">${obj.snippet}</p>
        //               <p class="info-item">${obj.weburl}</p>
        //     </div>`;
      });
    cardMarkup += cardMarkupLi + cardMarkupDiv.join('') + '</div></li>';
  }
  cardList.innerHTML = cardMarkup;
}

function onClick(e) {
  console.log(e.target.tagName);
  console.log(e.target.children);

  // ----если нажали на заголовок H2, то выбираем в массив все DIVы у тега LI который выше заголовка H2----

  if (e.target.tagName === 'H2') {
    let svg = e.target.children;
    for (let item of svg) item.classList.toggle('visually-hidden');

    let cont = e.target.parentNode.querySelectorAll('.date-wrap');
    for (let item of cont) item.classList.toggle('visually-hidden');
  }
}
