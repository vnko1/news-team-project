import {getStorageList} from './CommonFunctions' // імпорт моєї функції для взяття ваших данних з сториджу
​
// gallery-container - додатковий класс на контейнер в якому малюється розмітка
const gallery = document.querySelector('.gallery-container');
​
function renderFavouriteCardFromStorage() {
  // моя функція для отримання масиву з сториджа
  const arrFavourites = getStorageList("favourites")
​
  // створюємо строку розмітки
  const markUp = arrFavourites.reduce((acc, el) => {
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
          <label for="favorite" id="${
            el.id
          }" class="label-favorite">Add to favorite</label>
          <input type="checkbox" class="input-favorite" id="favorite"/>
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
        <a class="news-card__more" href="${el.url}" id="${el.id}"}>Read more</a>
      </div>
    </div>`;
    return acc;
  }, ``);
  // додоємо створену розмітку в DOM є 2 варіанти
  // 1
  gallery.insertAdjacentHTML('beforeend', markUp);
  // 2
  // gallery.innerHTML = markUp;
}

addClassesForCoincidencesMarkupAndStorage()










//  _____Zaglushka from Bohdan Kushnerov

// const BASE_URL =
//   "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=election&api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY";

// const divRef = document.querySelector(".zaglushka");
// // const imgRef = document.querySelector(".card__img");
// const btnRef = document.querySelector(".card__btn");

// const res = fetch(BASE_URL)
//   .then((res) => res.json())
//   .then((data) => {
//     // console.log(data.response.docs);
//     createDivMarkup(data.response.docs);

//   })
//   .catch((error) => {
//     console.log(error);
//   });

// //----------------------------------------------------------

// function createMarkup(dataOfOneCard) {
//   const {multimedia, headline: {main}, abstract, pub_date, web_url, _id} = dataOfOneCard;
//   // console.log(dataOfOneCard)

//   const date = new Date(pub_date)
//   const convertDate = `${String(date.getDate()).padStart(2, 0)}/${String(date.getMonth() + 1).padStart(2, 0)}/${String(date.getFullYear())}`;

// {/* <img class="card__img" src="https://static01.nyt.com/${multimedia[0].url}" alt="Заглушка" width="395" height="395"></img> */}
//   return `
//     <div class="card">
//       <h2 class="card__title" data-card-title>${main}</h2>
//       <p class="card__description">${abstract}</p>
//       <p class="card__news-create-date">${convertDate}</p>
//       <a class="card__news-link" href="${web_url}" id="${_id}">Read more</a>
//       <button class="card__btn">Add to favorite</button>
//     </div>
//   `;
// }

// //------------------------------------------------------------


// function createDivMarkup(data) {
//    const markup = data.reduce((acc, data)=>createMarkup(data)+ acc,'')

//   updateDivMarkup(markup);
// }

// function updateDivMarkup(markup) {
//   divRef.innerHTML = markup;
// }
// //------------------------------------------------------------
// //------------------------------------------------------------

// // если локалСторидж пустой дает пустой массив visitedLinks
// if (localStorage.getItem('favourites') === null) {
//   localStorage.setItem('favourites', JSON.stringify([]));
// }

//  // дает массив прочитаных статтей
// function getVisitedLinks() {
//   return JSON.parse(localStorage.getItem('favourites'));
// }

// divRef.addEventListener('click', onLinkClick);

// // кликаем на линк и сохраняем в локалСторидж
// // при повторном клике удаляем
// function onLinkClick(event) {
//   event.preventDefault();

//   if (event.target.textContent === 'Add to favorite') {
//     // const arrayOfLinksRef = document.querySelectorAll('a.card__news-link');

//     const arrayChildren = event.target.parentNode.children;
//       // console.log(arrayChildren)

//       const title = arrayChildren[0].textContent;
//       const descr = arrayChildren[1].textContent;
//       const dateArticle = arrayChildren[2].textContent;
//       const link = arrayChildren[3].href;
//       const id = arrayChildren[3].id

//       // console.dir(id)

//       const newObj = {
//           id,
//           title,
//           descr,
//           dateArticle,
//           link,
//         }

//       const visitedLinks = getVisitedLinks();
//       const myResult = visitedLinks.some((object) => object.id === newObj.id)

//       if(!myResult) {
//         visitedLinks.push(newObj);
//         localStorage.setItem('favourites', JSON.stringify(visitedLinks));
//       } else {
//         // удаление с ЛокалСториджа
//         const linkIndex = visitedLinks.findIndex(
//           object => object.id === newObj.id
//         );

//         console.log(linkIndex)
//         visitedLinks.splice(linkIndex, 1);
//         localStorage.setItem('favourites', JSON.stringify(visitedLinks));
//       //   reload page when "remove news"
//         document.location.reload(); 
//       }
//       }
//     };
// // ___________рендер списку карток _________________________________

// // не знаю ім я та путь звідки імпортувати логіку картки
// // import { export1, export2 } from "module-name";

// // function getStorageList(valueOfKeyStorage) {
// //   try{
// //   return JSON.parse(localStorage.getItem(valueOfKeyStorage));
// // } catch (error) {
// //       console.log(error)
// //     }
// // };  
// //   const favouriteLinks = getStorageList("favourites");


// const refs = {
//     favoriteNewsList:document.querySelector(".favorite"),
// };
// // const favoriteNewsStorage = localStorage.getItem("favourites");
// // const parsedFavoriteNewsStorage = JSON.parse(favoriteNewsStorage);

// let parsedFavoriteNewsStorage ;
// try{
// const favoriteNewsStorage = localStorage.getItem("favourites");
// // console.log(favoriteNewsStorage);
// parsedFavoriteNewsStorage = JSON.parse(favoriteNewsStorage);

//   } catch (error) {
//         console.log(error)
//       }


// // console.log(parsedFavoriteNewsStorage);

// function getFavoriteList(){
   
//     const markup = parsedFavoriteNewsStorage.map((i) => {
//       // стандартна зразкова картка
//     //   return `<div class="news-card favorite__list" news-id="${i.id}">
//     //   <div class="news-card__img">
//     //     <p class="news-card__theme">${i.category}</p>
//     //     <img
//     //       class="news-card__item"
//     //       src="${i.img}"
//     //       alt="${i.descr ? i.descr : 'photo'}"
//     //       loading="lazy"
//     //       width="395"
//     //     />
//     //     <div class="news-card__favorite">
//     //       <label for="favorite" id="${
//     //         i.id
//     //       }" class="label-favorite">Add to favorite</label>
//     //       <input type="checkbox" class="input-favorite" id="favorite"/>
//     //     </div>
//     //   </div>
//     //   <h2 class="news-card__info-title">${i.title}</h2>
//     //   <p class="news-card__info-text">${
//     //     i.descr.length > 180
//     //       ? i.descr.slice(0, 180) + '...'
//     //       : i.descr
//     //   }</p>
//     //   <div class="news-card__additional">
//     //     <p class="news-card__date">${i.dateArticle}</p>
//     //     <a class="news-card__more" href="${i.link}" id="${i.id}"}>Read more</a>
//     //   </div>
//     // </div>`}).join('');

//     // картка для рендеру заглушки, тестова
//     return `<div class="news-card favorite__list" news-id="${i.id}">
//     <div class="news-card__img">
//     <div class="news-card__favorite">
//       <label for="favorite" id="${i.id}" class="label-favorite">Add to favorite</label>
//         <input type="checkbox" class="input-favorite" id="favorite"/>
//     </div>
//     </div>
//     <h2 class="news-card__info-title">${i.title}</h2>
//     <p class="news-card__info-text">${i.descr.length > 180
//       ? i.descr.slice(0, 180) + '...'
//       : i.descr
// }   </p>
//     <div class="news-card__additional">
//       <p class="news-card__date">${i.dateArticle}</p>
//       <a class="news-card__more" href="${i.link}" id="${i.id}"}>Read more</a>
//     </div>
//   </div>`}).join('');
//       console.log(markup);
//          refs.favoriteNewsList.insertAdjacentHTML('beforeEnd', markup);
//          console.log(markup); 
//       return
// }

// getFavoriteList();





