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
// const otherCategoriesBtn = document.querySelector(
//   '.selected_container .filters__button'
// );
const arrow = document.querySelector('.category_svg_icon');


const dropdownBtn = document.querySelector('.category_btn');
const dropdownMenu = document.querySelector('.category_dropdown');
const categoryContainerCopy = document.querySelector('.category');
const notDropdownBtnContainer = document.querySelector(
  '.category_notdropdownbtn_container'
);
const body = document.querySelector('body');
const nonDropdownBtn = document.querySelectorAll('.category_nondropdown_btn');



filterBtnsWrap.addEventListener('click', onClickCategoryBtn);
dropdownBtn.addEventListener('click', onClickOthersBtn);
selectedList.addEventListener('click', onClickOtherCategory);
// window.addEventListener('click', () => {

//   if (dropdownMenu.classList.contains('shown')) {
//     dropdownMenu.classList.remove('shown');
//   }})


createFilters();


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
  try {
     spinner.spin(document.body);
    e.preventDefault();
    const query = e.target.textContent;
    otherCategoriesBtn.innerText = query;
    fetchNews.resetData();
    fetchNews.resetStorageData();

    fetchNews.setFilterQuery(query.toLowerCase());

    deleteNewsCards();
    const response = await fetchNews.fetchNewsByFilter();

    const {
      data: { results },
    } = response;

    console.log('💛💙💪  results:', results);
    spinner.stop();
    
    if (results === null) {
      fetchNews.resetData();
      fetchNews.resetStorageData();
      deleteNewsCards();
      
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

function createSelectedList({ display_name }) {
  return `<a class="selected__item" href="">${display_name}</a>`;
}

function appendSelectedList(murkupForSelectedList) {
  selectedList.insertAdjacentHTML('afterbegin', murkupForSelectedList);
}

function appendNotFoundImage() {
  galleryContainer.innerHTML ='';

  const image = document.createElement('img');
  image.src = '../images/logo.png';
  image.alt = 'We haven’t found news from this category';

  galleryContainer.append(image);
}

async function createFilters () {
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



  const mediaQueryDesktop = window.matchMedia('(min-width: 1280px)')
  const mediaQueryTablet = window.matchMedia('screen and (min-width: 768px) and (max-width: 1279px')  
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
  renderDesktopCategories(mediaQueryDesktop)
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
  addMarkup(markup);}
  
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
console.log(error)
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


function onClickOthersBtn() {
  arrow.style.fill = '#ffffff';
  selectedList.classList.toggle('shown');
  arrow.classList.toggle('arrow-rotate')  
}