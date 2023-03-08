import { fetchNews } from './fetchNews';
import {
  saveCategoryData,
  renderNewsCards,
  deleteNewsCards,
  addClassesForCoincidencesMarkupAndStorage,
  hideNotFoundMessage,
  showNotFoundMessage,
} from './commonFunctions';
// import Notiflix, { Notify } from 'notiflix';
import { spinner } from './libraries';
import { paginationByQuery } from './pagination';

// Notify.init({
//   width: '400px',
//   cssAnimation: true,
//   cssAnimationDuration: 400,
//   cssAnimationStyle: 'fade',
//   borderRadius: '10px',
//   position: 'center-top',
//   closeButton: false,
//   timeout: 1500,
// });

const galleryContainer = document.querySelector('.gallery-container');
// const categoryContainer = document.querySelector('.filters .container');
const filterBtnsWrap = document.querySelector('.filters__button-wrap');
const selectedList = document.querySelector('.selected_list');
const filterCategory = document.querySelectorAll('.filters__button');
const otherCategoriesBtn = document.querySelector(
  '.selected_container .filters__button'
);

const dropdownBtn = document.querySelector('.category_btn');
const dropdownMenu = document.querySelector('.category_dropdown');
// const categoryContainerCopy = document.querySelector('.category');
const notDropdownBtnContainer = document.querySelector(
  '.category_notdropdownbtn_container'
);

const categoryContainer = document.querySelector('.selected_container');

filterBtnsWrap.addEventListener('click', onClickCategoryBtn);
otherCategoriesBtn.addEventListener('click', onClickOthersBtn);
selectedList.addEventListener('click', onClickOtherCategory);

createFilters();

//  це функція яка викликатиметься при натисканні на кнопку - фільтр,
async function onClickCategoryBtn(e) {
  try {
    if (e.target.nodeName === 'BUTTON') {
      spinner.spin(document.body);
      const query = e.target.innerText.toLowerCase();
      hideNotFoundMessage();
      fetchNews.resetData();
      fetchNews.resetStorageData();
      fetchNews.resetCategoryData();
      fetchNews.setFilterQuery(query);

      const response = await fetchNews.fetchNewsByFilter();

      const {
        data: { results },
      } = response;

      if (results === null) {
        deleteNewsCards();
        showNotFoundMessage();
        spinner.stop();
        return;
      }

      fetchNews.setHits(results.length);
      fetchNews.setFilterParams(fetchNews.getFilterParams());
      saveCategoryData(results);

      deleteNewsCards();
      renderNewsCards();
      paginationByQuery();

      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(true);
      addClassesForCoincidencesMarkupAndStorage();
    }
  } catch (error) {
    console.error(error.message);
    spinner.stop();
  }
  spinner.stop();
}

async function onClickOtherCategory(e) {
  try {
    selectedList.classList.toggle('shown');
    hideNotFoundMessage();
    spinner.spin(document.body);
    fetchNews.resetData();
    fetchNews.resetStorageData();
    fetchNews.resetCategoryData();
    const query = e.target.textContent;
    otherCategoriesBtn.innerText = query;

    fetchNews.setFilterQuery(query.toLowerCase());
    const response = await fetchNews.fetchNewsByFilter();

    const {
      data: { results },
    } = response;

    if (results === null) {
      deleteNewsCards();
      showNotFoundMessage();
      // appendNotFoundImage();
      spinner.stop();
      return;
    }
    fetchNews.setHits(results.length);

    fetchNews.setFilterParams(fetchNews.getFilterParams());
    saveCategoryData(results);
    deleteNewsCards();
    renderNewsCards();
    paginationByQuery();

    fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
    fetchNews.setIsUrlRequest(true);
    addClassesForCoincidencesMarkupAndStorage();
  } catch (error) {
    console.error(error.message);
    spinner.stop();
  }
  spinner.stop();
}

function createSelectedList({ display_name }) {
  return `<a class="selected__item" href="">${display_name}</a>`;
}

function appendSelectedList(murkupForSelectedList) {
  selectedList.insertAdjacentHTML('afterbegin', murkupForSelectedList);
}

function onClickOthersBtn() {
  selectedList.classList.toggle('shown');
  document.addEventListener('click', onWindowClick);
}

// function appendNotFoundImage() {
//   const image = document.createElement('img');
//   image.src = '';
//   image.alt = 'We haven’t found news from this category';
//   galleryContainer.append(image);
// }

async function createFilters() {
  try {
    const results = await fetchNews.getCategoryNames();
    const shortResults = results
      .filter(result => result.display_name.length <= 10)
      .sort();

    const categoriesAll = shortResults.map(({ section, display_name }) => {
      return display_name;
    });

    const categoriesForTabletBtn = shortResults.reduce((acc, result) => {
      if (shortResults.indexOf(result) <= 3) {
        acc.push(result.display_name);
      }
      return acc;
    }, []);

    const categoriesForTabletList = shortResults.reduce((acc, result) => {
      if (shortResults.indexOf(result) > 3) {
        acc.push(result.display_name);
      }
      return acc;
    }, []);

    const categoriesForDesktopBtn = shortResults.reduce((acc, result) => {
      if (shortResults.indexOf(result) <= 5) {
        acc.push(result.display_name);
      }
      return acc;
    }, []);

    const categoriesForDesktopList = shortResults.reduce((acc, result) => {
      if (shortResults.indexOf(result) > 5) {
        acc.push(result.display_name);
      }
      return acc;
    }, []);

    const mediaQueryDesktop = window.matchMedia('(min-width: 1280px)');
    const mediaQueryTablet = window.matchMedia(
      'screen and (min-width: 768px) and (max-width: 1279px'
    );
    const mediaQueryMobile = window.matchMedia('(max-width: 767px)');

    // Register event listener
    mediaQueryDesktop.addListener(renderDesktopCategories);
    mediaQueryTablet.addListener(renderTabletCategories);
    mediaQueryMobile.addListener(renderMobileCategories);

    // Initial check
    renderDesktopCategories(mediaQueryDesktop);
    renderTabletCategories(mediaQueryTablet);
    renderMobileCategories(mediaQueryMobile);

    if (mediaQueryMobile.matches) {
      renderMobileCategories(mediaQueryMobile);
    } else if (mediaQueryTablet.mathes) {
      renderTabletCategories(mediaQueryTablet);
    } else {
      renderDesktopCategories(mediaQueryDesktop);
    }

    async function renderDesktopCategories(e) {
      // Check if the media query is true
      if (e.matches) {
        dropdownBtn.firstChild.textContent = 'Others';
        const markupBtn = categoriesForDesktopBtn.reduce((acc, category) => {
          return (acc += createButtons(category));
        }, '');
        addButtons(markupBtn);
        const markupList = categoriesForDesktopList.reduce((acc, category) => {
          return (acc += createMarkup(category));
        }, '');
        addMarkup(markupList);
      }
    }
    async function renderMobileCategories(e) {
      if (e.matches) {
        dropdownBtn.firstChild.textContent = 'Categories';
        const markup = categoriesAll.reduce((acc, category) => {
          return (acc += createMarkup(category));
        }, '');
        notDropdownBtnContainer.innerHTML = '';
        addMarkup(markup);
      }
    }
    async function renderTabletCategories(e) {
      // Check if the media query is true
      if (e.matches) {
        dropdownBtn.firstChild.textContent = 'Others';
        const markupBtn = categoriesForTabletBtn.reduce((acc, category) => {
          return (acc += createButtons(category));
        }, '');
        addButtons(markupBtn);

        const markupList = categoriesForTabletList.reduce((acc, category) => {
          return (acc += createMarkup(category));
        }, '');

        addMarkup(markupList);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(category) {
  return `<a class="category_dropdown_item selected__item" href="#">${category}</a>`;
}

function createButtons(category) {
  return `<button class="category_btn category_nondropdown_btn filters__button" href="#">${category}</button>`;
}

function addMarkup(markup) {
  dropdownMenu.innerHTML = `${markup}`;
}

function addButtons(markup) {
  notDropdownBtnContainer.innerHTML = `${markup}`;
}

// async function fetchCategoryNames() {
//   try {
//     const categoryResults = await fetchNews.getCategoryNames();
//     const categoryWithShortName = categoryResults
//       .filter(result => result.display_name.length <= 10)
//       .sort();

//     const firstSixCategory = [];
//     const otherCategoryNames = [];

//     for (let i = 0; i <= 5; i += 1) {
//       firstSixCategory.push(categoryWithShortName[i]);
//     }
//     for (let i = 6; i < categoryWithShortName.length; i += 1) {
//       otherCategoryNames.push(categoryWithShortName[i]);
//     }

//     for (let i = 0; i < firstSixCategory.length; i += 1) {
//       filterCategory[i].innerText = firstSixCategory[i].display_name;
//     }

//     const murkupForSelectedList = otherCategoryNames.reduce(
//       (murkup, result) => murkup + createSelectedList(result),
//       ''
//     );

//     appendSelectedList(murkupForSelectedList);
//   } catch (error) {
//     console.error(error.message);
//   }
// }

function onWindowClick(e) {
  const withinBoundaries = e.composedPath().includes(categoryContainer);
  if (!withinBoundaries) {
    dropdownMenu.classList.remove('shown');
    document.removeEventListener('click', onWindowClick);
  }
}
