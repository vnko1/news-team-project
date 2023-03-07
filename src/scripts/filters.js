import axios from 'axios';
import { fetchNews } from './FetchNews';
import {
  saveCategoryData,
  renderNewsCards,
  deleteNewsCards,
  addClassesForCoincidencesMarkupAndStorage,
} from './CommonFunctions';
import Notiflix, { Notify } from 'notiflix';
import { spinner } from './Libraries';

Notify.init({
  width: '400px',
  cssAnimation: true,
  cssAnimationDuration: 400,
  cssAnimationStyle: 'fade',
  borderRadius: '10px',
  position: 'center-top',
  closeButton: false,
  timeout: 1500,
});

const galleryContainer = document.querySelector('.gallery-container');
const categoryContainer = document.querySelector('.filters .container');
const filterBtnsWrap = document.querySelector('.filters__button-wrap');
const selectedList = document.querySelector('.selected_list');
const filterCategory = document.querySelectorAll('.filters__button');
const otherCategoriesBtn = document.querySelector(
  '.selected_container .filters__button'
);

// categoryContainer.addEventListener('click', onClickCategoryBtn);
filterBtnsWrap.addEventListener('click', onClickCategoryBtn);
otherCategoriesBtn.addEventListener('click', onClickOthersBtn);
selectedList.addEventListener('click', onClickOtherCategory);

fetchCategoryNames();

//  це функція яка викликатиметься при натисканні на кнопку - фільтр,
async function onClickCategoryBtn(e) {
  try {
    if (e.target.nodeName === 'BUTTON') {
      spinner.spin(document.body);
      const query = e.target.innerText.toLowerCase();
      fetchNews.resetData();
      fetchNews.resetStorageData();

      fetchNews.setFilterQuery(query);

      deleteNewsCards();
      const response = await fetchNews.fetchNewsByFilter();

      const {
        data: { results },
      } = response;
      spinner.stop();
      if (results === null) {
        fetchNews.resetData();
        fetchNews.resetStorageData();
        deleteNewsCards();
        Notify.failure('We haven’t found news from this category');
        // appendNotFoundImage();
        return;
      }
      deleteNewsCards();
      fetchNews.setHits(20);

      fetchNews.setFilterParams(fetchNews.getFilterParams());
      saveCategoryData(results);
      // console.log(fetchNews.getData());
      // console.log(fetchNews.getStorageData());
      renderNewsCards();

      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(true);
      addClassesForCoincidencesMarkupAndStorage();
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function onClickOtherCategory(e) {
  spinner.spin(document.body);
  e.preventDefault();
  selectedList.classList.remove('shown');
  const query = e.target.textContent;
  otherCategoriesBtn.innerText = query;
  try {
    fetchNews.resetData();
    fetchNews.resetStorageData();

    fetchNews.setFilterQuery(query.toLowerCase());

    deleteNewsCards();
    const response = await fetchNews.fetchNewsByFilter();

    const {
      data: { results },
    } = response;
    spinner.stop();
    if (results === null) {
      fetchNews.resetData();
      fetchNews.resetStorageData();
      deleteNewsCards();
      Notify.failure('We haven’t found news from this category');
      // appendNotFoundImage();
      return;
    }
    deleteNewsCards();
    fetchNews.setHits(20);

    fetchNews.setFilterParams(fetchNews.getFilterParams());
    saveCategoryData(results);
    // console.log(fetchNews.getData());
    // console.log(fetchNews.getStorageData());
    renderNewsCards();

    fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
    fetchNews.setIsUrlRequest(true);
    addClassesForCoincidencesMarkupAndStorage();
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchCategoryNames() {
  try {
    const categoryResults = await fetchNews.getCategoryNames();
    const categoryWithShortName = categoryResults
      .filter(result => result.display_name.length <= 10)
      .sort();

    const firstSixCategory = [];
    const otherCategoryNames = [];

    for (let i = 0; i <= 5; i += 1) {
      firstSixCategory.push(categoryWithShortName[i]);
    }
    for (let i = 6; i < categoryWithShortName.length; i += 1) {
      otherCategoryNames.push(categoryWithShortName[i]);
    }

    for (let i = 0; i < firstSixCategory.length; i += 1) {
      filterCategory[i].innerText = firstSixCategory[i].display_name;
    }

    const murkupForSelectedList = otherCategoryNames.reduce(
      (murkup, result) => murkup + createSelectedList(result),
      ''
    );

    appendSelectedList(murkupForSelectedList);
  } catch (error) {
    console.error(error.message);
  }
}

// async function createFilters (){
//   try {
//   const mediaQueryDesktop = window.matchMedia('(min-width: 1280px)')
//   const mediaQueryTablet = window.matchMedia('(min-width: 768px) && (max-width: 1279px)');
//   const mediaQueryMobile = window.matchMedia('(max-width: 767px)');


// function handleViewportChange(e) {
//   // Check if the media query is true
//   if (e.matches) {
//     // Then log the following message to the console
//     Notify.info('Media query is allright'); 
//   }
//   Notify.failure('Media query is false')
// }
// // Register event listener
// mediaQueryDesktop.addListener(handleTabletChange)

// // Initial check
// handleViewportChange(mediaQueryDesktop);
//   } catch (error) {
// console.log(error)
//   }
// }

function createSelectedList({ display_name }) {
  return `<a class="selected__item" href="">${display_name}</a>`;
}

function appendSelectedList(murkupForSelectedList) {
  selectedList.insertAdjacentHTML('afterbegin', murkupForSelectedList);
}

function appendNotFoundImage() {
  const image = document.createElement('img');
  image.src = '';
  image.alt = 'We haven’t found news from this category';
  galleryContainer.append(image);
}

function onClickOthersBtn() {
  selectedList.classList.add('shown');
}
