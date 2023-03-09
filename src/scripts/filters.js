import { fetchNews } from './fetchNews';
import {
  saveCategoryData,
  renderNewsCards,
  deleteNewsCards,
  addClassesForCoincidencesMarkupAndStorage,
  renderNoFoundMess,
  deleteNoFoundMess,
} from './commonFunctions';
// import Notiflix, { Notify } from 'notiflix';
import { spinner } from './libraries';
import { paginationByQuery, deletePagination } from './pagination';

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
// const filterCategory = document.querySelectorAll('.filters__button');
const otherCategoriesBtn = document.querySelector(
  '.selected_container .filters__button'
);

const arrow = document.querySelector('.category_svg_icon');
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
      deleteNoFoundMess();
      deletePagination();
      fetchNews.resetData();
      fetchNews.resetStorageData();
      fetchNews.resetCategoryData();
      fetchNews.setFilterQuery(query);

      const response = await fetchNews.fetchNewsByFilter();

      const {
        data: { results },
      } = response;

      if (results === null) {
        renderNoFoundMess();
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
  deleteNoFoundMess();
  deletePagination();
  try {
    selectedList.classList.toggle('shown');
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
      renderNoFoundMess();
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
  arrow.style.fill = '#ffffff';
  arrow.classList.toggle('arrow-rotate');
  selectedList.classList.toggle('shown');
  document.addEventListener('click', onWindowClick);
}

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
  return `<button class="category_btn category_nondropdown_btn filters__button" >${category}</button>`;
}

function addMarkup(markup) {
  dropdownMenu.innerHTML = `${markup}`;
}

function addButtons(markup) {
  notDropdownBtnContainer.innerHTML = `${markup}`;
}

function onWindowClick(e) {
  const withinBoundaries = e.composedPath().includes(categoryContainer);
  if (!withinBoundaries) {
    arrow.style.fill = '#4440f7';
    dropdownMenu.classList.remove('shown');
    document.removeEventListener('click', onWindowClick);
  }
}
