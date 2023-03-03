const articlesContainer = document.querySelector('.js-articles-container');


const BASE_URL =
  'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';


const res = fetch(BASE_URL)
  .then(res => res.json())
  .then(data => {
    // console.log(data);
    const slicedData = data.results.slice(0, 8);
    createDivMarkup(slicedData);
    console.log(slicedData);
  })
  .catch(error => {
    console.log(error);
  });

function createDivMarkup(data) {
  const markup = data.reduce((acc, data) => createMarkup(data) + acc, '');

  updateDivMarkup(markup);
}

function updateDivMarkup(markup) {
  articlesContainer.innerHTML = markup;
}
function createMarkup(dataOfOneCard) {
  const { media, title, abstract, published_date, url, id } = dataOfOneCard;
  // console.log(dataOfOneCard)

  const date = new Date(published_date);
  const convertDate = `${String(date.getDate()).padStart(2, 0)}/${String(
    date.getMonth() + 1
  ).padStart(2, 0)}/${String(date.getFullYear())}`;

  {
    /* <img class="card__img" src="https://static01.nyt.com/${multimedia[0].url}" alt="Заглушка" width="395" height="395"></img> */
  }
  return `
    <div class="card">
    <div class="news-card__img"> 
    <img class="card__img" src="https://static01.nyt.com/${media}" alt="Заглушка" width="395" height="395"></img> 
      <h2 class="card__title" data-card-title>${title}</h2>
      <p class="card__description">${abstract}</p>
      <p class="card__news-create-date">${convertDate}</p>
      <a class="card__news-link" href="${url}" id="${id}">Read more</a>
      <button class="card__btn">Add to favorite</button>
      <div>
    </div>
  `;
}

