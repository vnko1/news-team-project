// import serviceApi from './api-key';

const formEl = document.querySelector('#search-form');
const articlesContainer = document.querySelector('.js-articles-container');

// // const serviceApi = new ApiService();
// // console.log(serviceApi);

// formEl.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  serviceApi.query = e.currentTarget.elements.searchQuery.value;
  const form = e.currentTarget;
  // console.log(form);
  const value = form.elements.searchQuery.value.trim();

  // if (serviceApi.query === '') {
  //   return alert('Введи что-то нормальное');
  // }
  serviceApi(value)
    .then(({ articles }) => {
      if (articles.length === 0) throw new Error('No data');

      return articles.reduce(
        (markup, article) => createMarkup(article) + markup,
        ''
      );
    })
    .then(updateNewsList)
    .catch(onError)
    .finally(() => form.reset());
}

function updateNewsList(markup) {
  articlesContainer.innerHTML = markup;
}

// // serviceApi.resetPage();
// // fetchArticles();
// // clearArticlesContainer();

// //
// // function fetchArticles() {
// //   serviceApi.fetchArticles().then(articles => {
// //     appendArticlesMarkup(articles);
// //   });
// // }

// // function appendArticlesMarkup(articles) {
// //   articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(articles));
// // }

// // function clearArticlesContainer() {
// //   articlesContainer.innerHTML = '';
// // }

// // Запрос на популярние то витягуєм title
// fetchPopular().then(renderCard).catch(error => console.log(error));

// function fetchPopular() {
//     return fetch(
//         'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY'
//     )
//         .then(response => {
//             return response.json();
//         })

// }
// function renderCard(mostpopular) {
//   const markup = createMarkup(mostpopular);
//   articlesContainer.innerHTML = markup;
// }

const BASE_URL =
  'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';


const res = fetch(BASE_URL)
  .then(res => res.json())
  .then(data => {
    // console.log(data);
    createDivMarkup(data.results);
      // console.log(data.results);
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

// за популярними:
// категорія: section,
// заголовок: title
// короткий опис: abstract
// дата: published_date
// елемент read more: url
// / Відображаємо лише 8 елементів
//       const slicedData = data.response.docs.slice(0, 8);
// ти береш дані які приходять у відповідь з апішки та обрізаєш їх до потрібної довжини