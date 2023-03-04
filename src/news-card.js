// import axios from 'axios';
// import CalendarDates from 'calendar-dates';

// https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY

// const imgRef = document.querySelector(".card__img");
// const btnRef = document.querySelector(".card__btn");
// const linkRef = document.querySelector(".card__news-link")
// console.log(linkRef)

const BASE_URL =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY";

const divRef = document.querySelector(".gallery");

const res = fetch(BASE_URL)
  .then((res) => res.json())
  .then((data) => {
    // console.log(data.response.docs);
    createDivMarkup(data.response.docs);

  })
  .catch((error) => {
    console.log(error);
  });

//----------------------------------------------------------

function createMarkup(dataOfOneCard) {
  const {multimedia, headline: {main}, abstract, pub_date, web_url, _id} = dataOfOneCard;
  // console.log(dataOfOneCard)

  const date = new Date(pub_date)
  const convertDate = `${String(date.getDate()).padStart(2, 0)}/${String(date.getMonth() + 1).padStart(2, 0)}/${String(date.getFullYear())}`;

{/* <img class="card__img" src="https://static01.nyt.com/${multimedia[0].url}" alt="Заглушка" width="395" height="395"></img> */}
  return `
    <div class="card">
      <h2 class="card__title" data-card-title>${main}</h2>
      <p class="card__description">${abstract}</p>
      <p class="card__news-create-date">${convertDate}</p>
      <a class="card__news-link" href="${web_url}" id="${_id}">Read more</a>
      <button class="card__btn">Add to favorite</button>
    </div>
  `;
}

//------------------------------------------------------------

function createDivMarkup(data) {
  const markup = data.reduce((acc, data)=>createMarkup(data) + acc,'')

  updateDivMarkup(markup);
}

function updateDivMarkup(markup) {
  divRef.innerHTML = markup;
}
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------

// если локалСторидж пустой дает пустой массив visitedLinks
if (localStorage.getItem('favourites') === null) {
  localStorage.setItem('favourites', JSON.stringify([]));
} 

if(localStorage.getItem('Read more') === null) {
  localStorage.setItem('Read more', JSON.stringify([]));
}

 // дает массив прочитаных статтей
function getFavouritesList() {
  return JSON.parse(localStorage.getItem('favourites'));
}

function getReadMoreList() {
  return JSON.parse(localStorage.getItem('Read more'));
}

divRef.addEventListener('click', onButtonClick);

// кликаем на линк и сохраняем в локалСторидж
// при повторном клике удаляем
function onButtonClick(event) {
  // event.preventDefault();
  if (event.target.textContent === 'Add to favorite') {

    // забираем значения с зарендереной карточки
      const arrayChildren = event.target.parentNode.children;
      // console.log(arrayChildren)
      const title = arrayChildren[0].textContent;
      const descr = arrayChildren[1].textContent;
      const dateArticle = arrayChildren[2].textContent;
      const link = arrayChildren[3].href;
      const id = arrayChildren[3].id

      console.dir(arrayChildren)

      const newObj = {
          id,
          title,
          descr,
          dateArticle,
          link,
        }

      const visitedLinks = getFavouritesList();
      console.log(visitedLinks)
      const myResult = visitedLinks.some((object) => object.id === newObj.id)

      if(!myResult) {
        visitedLinks.push(newObj);
        localStorage.setItem('favourites', JSON.stringify(visitedLinks));
      } else {
        // удаление со ЛокалСториджа
        const linkIndex = visitedLinks.findIndex(
          object => object.id === newObj.id
        );
        console.log(linkIndex)
        visitedLinks.splice(linkIndex, 1);
        localStorage.setItem('favourites', JSON.stringify(visitedLinks));
      }
      }

      
    };
// /////////////////////READ MORE////////////////////////////

divRef.addEventListener('click', onLinkClick) 

function onLinkClick(event) {
  event.preventDefault()
  if(event.target.textContent === 'Read more') {
      const arrayChildren = event.target.parentNode.children;

      const title = arrayChildren[0].textContent;
      const descr = arrayChildren[1].textContent;
      const dateArticle = arrayChildren[2].textContent;
      const link = arrayChildren[3].href;
      const id = arrayChildren[3].id
      // console.log(arrayChildren)

      const date = new Date()
      const convertDate = `${String(date.getDate()).padStart(2, 0)}/${String(date.getMonth() + 1).padStart(2, 0)}/${String(date.getFullYear())}`;
      console.log(date)

      const newObj = {
          convertDate,
          id,
          title,
          descr,
          dateArticle,
          link,
        }

      const readMoreList = getReadMoreList();
      console.log(readMoreList)
      const myResult = readMoreList.some((object) => object.id === newObj.id)

      if(!myResult) {
        readMoreList.push(newObj);
        localStorage.setItem('Read more', JSON.stringify(readMoreList));
      } else {
        // удаление со ЛокалСториджа и перезапись
        const linkIndex = readMoreList.findIndex(
          object => object.id === newObj.id
        );
        // console.log(linkIndex)
        readMoreList.splice(linkIndex, 1);
        readMoreList.push(newObj);
        localStorage.setItem('Read more', JSON.stringify(readMoreList));
      }
      }
}