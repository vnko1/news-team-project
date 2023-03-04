const galleryContainer = document.querySelector('.gallery-container');

function renderMostPopularCard() {
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
    galleryContainer.innerHTML = markup;
  }
  function createMarkup(dataOfOneCard) {
    // media = media[0]['media-metadata'][2].url;
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
}

renderMostPopularCard();
// function updateDivMarkup(markup) {
//   galleryContainer.innerHTML = markup;
// }
// function createMarkup(dataOfOneCard) {
//   // media = media[0]['media-metadata'][2].url;
//   const { media, title, abstract, published_date, url, id } = dataOfOneCard;
//   // console.log(dataOfOneCard)

//   const date = new Date(published_date);
//   const convertDate = `${String(date.getDate()).padStart(2, 0)}/${String(
//     date.getMonth() + 1
//   ).padStart(2, 0)}/${String(date.getFullYear())}`;

//   {
//     /* <img class="card__img" src="https://static01.nyt.com/${multimedia[0].url}" alt="Заглушка" width="395" height="395"></img> */
//   }
//   return `
//     <div class="card">
//     <div class="news-card__img">
//     <img class="card__img" src="https://static01.nyt.com/${media}" alt="Заглушка" width="395" height="395"></img>
//       <h2 class="card__title" data-card-title>${title}</h2>
//       <p class="card__description">${abstract}</p>
//       <p class="card__news-create-date">${convertDate}</p>
//       <a class="card__news-link" href="${url}" id="${id}">Read more</a>
//       <button class="card__btn">Add to favorite</button>
//       <div>
//     </div>
//   `;
// }

// renderMostPopularCard()

// {
//   Метод stopImmediatePropagation() інтерфейсу Event запобігає виклику інших слухачів тієї самої події.
// Якщо кілька слухачів приєднано до того самого елемента для того самого типу події, вони викликаються в тому порядку, в якому їх було додано.
//  Якщо stopImmediatePropagation() викликається під час одного такого виклику, інші слухачі не викликатимуться.
// }
// mostPopular();

// const galleryContainer = document.querySelector('.gallery-container');

// function renderMostPopularCard() {
//   // const BASE_URL =
//   //   'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';

//   // const res = fetch(BASE_URL)
//   //   .then(res => res.json())
//   //   .then(data => {
//   //     // console.log(data);
//   //     const slicedData = data.results.slice(0, 8);
//   //     createDivMarkup(slicedData);
//   //     console.log(slicedData);
//   //   })
//   //   .catch(error => {
//   //     console.log(error);
//   //   });
//   const renderData = [];
//   console.log(renderData);
//   const fetchData = fetchNews.getData();
//   console.log(fetchData);
//   for (let i = 0; i < fetchData.length; i++) {
//     if (i >= 8) break;
//     renderData.push(fetchData[i]);
//   }

//   function createDivMarkup(data) {
//     const markup = renderData.reduce(
//       (acc, renderData) => createMarkup(renderData) + acc,
//       ''
//     );

//     updateDivMarkup(markup);
//   }

//   function updateDivMarkup(markup) {
//     galleryContainer.innerHTML = markup;
//   }
//   function createMarkup(dataOfOneCard) {
//     // media = media[0]['media-metadata'][2].url;
//     const { media, title, abstract, published_date, url, id } = dataOfOneCard;
//     // console.log(dataOfOneCard)

//     const date = new Date(published_date);
//     const convertDate = `${String(date.getDate()).padStart(2, 0)}/${String(
//       date.getMonth() + 1
//     ).padStart(2, 0)}/${String(date.getFullYear())}`;

//     {
//       /* <img class="card__img" src="https://static01.nyt.com/${multimedia[0].url}" alt="Заглушка" width="395" height="395"></img> */
//     }
//     return `
//     <div class="card">
//     <div class="news-card__img">
//     <img class="card__img" src="https://static01.nyt.com/${media}" alt="Заглушка" width="395" height="395"></img>
//       <h2 class="card__title" data-card-title>${title}</h2>
//       <p class="card__description">${abstract}</p>
//       <p class="card__news-create-date">${convertDate}</p>
//       <a class="card__news-link" href="${url}" id="${id}">Read more</a>
//       <button class="card__btn">Add to favorite</button>
//       <div>
//     </div>
//   `;
//   }
// }
