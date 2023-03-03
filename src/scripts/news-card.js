// import axios from 'axios';
// import CalendarDates from 'calendar-dates';

// https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY

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
  const {
    multimedia,
    headline: { main },
    abstract,
    pub_date,
    web_url,
    _id,
  } = dataOfOneCard;
  // console.log(dataOfOneCard)

  const date = new Date(pub_date);
  const convertDate = `${String(date.getDate()).padStart(2, 0)}/${String(
    date.getMonth() + 1
  ).padStart(2, 0)}/${String(date.getFullYear())}`;

  const favouriteList = getStorageList("favourites");
  const readMoreList = getStorageList("Read more");

  const resultFavorite = favouriteList.some(obj=>obj.id === _id)
  const resultReadMore = readMoreList.some(obj=>obj.id === _id)
  
  if(resultReadMore && resultFavorite) {
    console.log('resultReadMore && resultFavorite')
    return `
    <div class="card">
      <h2 class="card__title" data-card-title>${main}</h2>
      <p class="card__description">${abstract}</p>
      <p class="card__news-create-date">${convertDate}</p>
      <a class="card__news-link storage-value" href="${web_url}" id="${_id}">Read more</a>
      <button class="card__btn storage-value">Add to favorite</button>
    </div>
  `;
  } else if (resultReadMore && !resultFavorite) {
    console.log('resultReadMore && !resultFavorite')
    return `
    <div class="card">
      <h2 class="card__title" data-card-title>${main}</h2>
      <p class="card__description">${abstract}</p>
      <p class="card__news-create-date">${convertDate}</p>
      <a class="card__news-link storage-value" href="${web_url}" id="${_id}">Read more</a>
      <button class="card__btn">Add to favorite</button>
    </div>
  `;
  } else if(!resultReadMore && resultFavorite) {
    console.log('!resultReadMore && resultFavorite')
    return `
    <div class="card">
      <h2 class="card__title" data-card-title>${main}</h2>
      <p class="card__description">${abstract}</p>
      <p class="card__news-create-date">${convertDate}</p>
      <a class="card__news-link" href="${web_url}" id="${_id}">Read more</a>
      <button class="card__btn storage-value">Add to favorite</button>
    </div>
  `;
  } else {
    console.log('совпадений нету')
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
}

//------------------------------------------------------------

function createDivMarkup(data) {
  const markup = data.reduce((acc, data) => createMarkup(data) + acc, "");

  updateDivMarkup(markup);
}

function updateDivMarkup(markup) {
  divRef.innerHTML = markup;
}
//-------------------Work with Storage---------------------------

// если локалСторидж пустой дает пустой массив visitedLinks
if (localStorage.getItem("favourites") === null) {
  addEmptyArrtoStorage("favourites");
}

if (localStorage.getItem("Read more") === null) {
  addEmptyArrtoStorage("Read more");
}

divRef.addEventListener("click", onClick);

function onClick(event) {
//--------------------Favourites--------------------------------
  if (event.target.textContent === "Add to favorite") {

    event.target.classList.toggle('storage-value')
    // забираем значения с зарендереной карточки
    const arrayChildren = event.target.parentNode.children;

    const newObj = {
      id: arrayChildren[3].id,
      title: arrayChildren[0].textContent,
      descr: arrayChildren[1].textContent,
      dateArticle: arrayChildren[2].textContent,
      link: arrayChildren[3].href,
    };

    const visitedLinks = getStorageList("favourites");
    const myResult = visitedLinks.some((object) => object.id === newObj.id);

    refreshFavouritesStorage(myResult, visitedLinks, newObj);
  }
//--------------------Read more--------------------------------
  if (event.target.textContent === "Read more") {
    event.preventDefault();
    event.target.classList.add('storage-value')
    
    const arrayChildren = event.target.parentNode.children;

    const newObj = {
      date: getDateForCreateObjToStorage(),
      id: arrayChildren[3].id,
      title: arrayChildren[0].textContent,
      descr: arrayChildren[1].textContent,
      dateArticle: arrayChildren[2].textContent,
      link: arrayChildren[3].href,
    };

    const readMoreList = getStorageList("Read more");
    const myResult = readMoreList.some((object) => object.id === newObj.id);

    refreshLinkStorage(myResult, readMoreList, newObj);
  }
}
//================================================

function refreshLinkStorage(myResult, list, newObj) {
  if (!myResult) {
    list.push(newObj);
    localStorage.setItem("Read more", JSON.stringify(list));
  } else {
    // удаление со ЛокалСториджа и перезапись
    const linkIndex = list.findIndex((object) => object.id === newObj.id);
    // console.log(linkIndex)
    list.splice(linkIndex, 1);
    list.push(newObj);
    localStorage.setItem("Read more", JSON.stringify(list));
  }
}

function refreshFavouritesStorage(myResult, list, newObj) {
  if (!myResult) {
    list.push(newObj);
    localStorage.setItem("favourites", JSON.stringify(list));
  } else {
    // удаление со ЛокалСториджа
    const linkIndex = list.findIndex((object) => object.id === newObj.id);
    // console.log(linkIndex)
    list.splice(linkIndex, 1);
    localStorage.setItem("favourites", JSON.stringify(list));
  }
}

function addEmptyArrtoStorage(valueOfKeyStorage) {
  localStorage.setItem(valueOfKeyStorage, JSON.stringify([]));
}

function getStorageList(valueOfKeyStorage) {
  return JSON.parse(localStorage.getItem(valueOfKeyStorage));
}

function getDateForCreateObjToStorage() {
  // const date = new Date()
  return new Date();
  // return `${String(date.getDate()).padStart(2, 0)}/${String(date.getMonth() + 1).padStart(2, 0)}/${String(date.getFullYear())}`;
}
