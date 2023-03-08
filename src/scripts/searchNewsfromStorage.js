import {getStorageList} from './commonFunctions'

// const inputEl = document.querySelector('.search-input');
const formEl = document.getElementById('search-form');
const galleryEl = document.querySelector('.gallery-container');

console.log(galleryEl)

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault()
  const searchValue = e.target.elements.searchQuery.value;

  const arr = getStorageList('favourites');

  const newArrObj = arr.filter(obj => obj.descr.toLowerCase().includes(searchValue.toLowerCase().trim()) || obj.category.toLowerCase().includes(searchValue.toLowerCase().trim()))
console.log(newArrObj)

render(newArrObj)
}

function render(arr) {

  const markUp = arr.reduce((acc, el) => {
    acc += `<div class="news-card" news-id="${el.id}">
      <div class="news-card__img">
        <p class="news-card__theme">${el.category}</p>
        <img
          class="news-card__item"
          src="${el.img}"
          alt="${el.alt ? el.alt : 'photo'}"
          loading="lazy"
          width="395"
        />
        <div class="news-card__favorite">
          <label for="favorite" id="${
            el.id
          }" class="label-favorite">Add to favorite</label>
          <input type="checkbox" class="input-favorite" id="favorite"/>
        </div>
      </div>
      <h2 class="news-card__info-title">${el.title}</h2>
      <p class="news-card__info-text">${el.descr.limit(180)}</p>
      <div class="news-card__additional">
        <p class="news-card__date">${el.dateArticle}</p>
        <a class="news-card__more" href="${el.link}" id="${
      el.id
    }" target="_blank" rel="noreferrer noopener"}>Read more</a>
      </div>
    </div>`;
    return acc;
  }, ``);
// console.log(markUp)
  galleryEl.innerHTML = markUp;
}