import { fetchNews } from './fetchNews';
import {
  saveSearchData,
  addClassesForCoincidencesMarkupAndStorage,
  renderNewsCards,
  deleteNewsCards,
} from './commonFunctions';

const gallery = document.querySelector('.gallery-container');
const prevCon = document.querySelector('.prev_container');
const nextCon = document.querySelector('.next_container');
const itemCont = document.querySelector('.item_container');

nextCon.addEventListener('click', handleNextPage);
prevCon.addEventListener('click', handlePreviousPage);
itemCont.addEventListener('click', handlePageByNumber);

export async function paginationByQuery() {
  const totalHits = fetchNews.getHits();
  const totalPages = Math.ceil(totalHits / 10);
  fetchNews.resetPage();
  startPagination(totalPages);
}

// ------------------------------------------------------------------------------------------------

async function handleNextPage() {
  fetchNews.incrementPage();

  deleteNewsCards();

  if (fetchNews.getUrl().includes('articlesearch')) {
    fetchNews.resetData();
    fetchNews.resetStorageData();

    try {
      const response = await fetchNews.fetchPagination();

      if (!response.data.response.docs.length) {
        console.log('закінчились новини');
        return;
      }

      const {
        data: {
          response: { docs },
        },
      } = response;

      saveSearchData(docs);
      renderNewsCards();
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(true);
      addClassesForCoincidencesMarkupAndStorage();
    } catch (error) {
      console.log(error);
    }
  } else {
    if (!fetchNews.isUrlRequest) {
      const data = fetchNews.getFiltredStorageData();
      renderPerPageNewsCardByData(data);
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(false);
      addClassesForCoincidencesMarkupAndStorage();
    } else {
      const data = fetchNews.getStorageData();
      renderPerPageNewsCardByData(data);
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(true);
      addClassesForCoincidencesMarkupAndStorage();
    }
  }
}

async function handlePreviousPage() {
  fetchNews.decrementPage();
  deleteNewsCards();

  if (fetchNews.getUrl().includes('articlesearch')) {
    fetchNews.resetData();
    fetchNews.resetStorageData();

    try {
      const response = await fetchNews.fetchPagination();

      if (!response.data.response.docs.length) {
        console.log('закінчились новини');
        return;
      }

      const {
        data: {
          response: { docs },
        },
      } = response;

      saveSearchData(docs);
      renderNewsCards();
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(true);
      addClassesForCoincidencesMarkupAndStorage();
    } catch (error) {
      console.log(error);
    }
  } else {
    if (!fetchNews.isUrlRequest) {
      const data = fetchNews.getFiltredStorageData();
      renderPerPageNewsCardByData(data);
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(false);
      addClassesForCoincidencesMarkupAndStorage();
    } else {
      const data = fetchNews.getStorageData();
      renderPerPageNewsCardByData(data);
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(true);
      addClassesForCoincidencesMarkupAndStorage();
    }
  }
}

async function handlePageByNumber(e) {
  fetchNews.setPage(Number(e.target.textContent) - 1);
  deleteNewsCards();

  if (fetchNews.getUrl().includes('articlesearch')) {
    fetchNews.resetData();
    fetchNews.resetStorageData();

    try {
      const response = await fetchNews.fetchPagination();

      if (!response.data.response.docs.length) {
        console.log('закінчились новини');
        return;
      }

      const {
        data: {
          response: { docs },
        },
      } = response;

      saveSearchData(docs);
      renderNewsCards();
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(true);
      addClassesForCoincidencesMarkupAndStorage();
    } catch (error) {
      console.log(error);
    }
  } else {
    if (!fetchNews.isUrlRequest) {
      const data = fetchNews.getFiltredStorageData();
      renderPerPageNewsCardByData(data);
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(false);
      addClassesForCoincidencesMarkupAndStorage();
    } else {
      const data = fetchNews.getStorageData();
      renderPerPageNewsCardByData(data);
      fetchNews.setNodeChild(document.querySelectorAll('.news-card'));
      fetchNews.setIsUrlRequest(true);
      addClassesForCoincidencesMarkupAndStorage();
    }
  }
}

function renderPerPageNewsCardByData(data) {
  if (!data) return;
  const array = [...data];
  const subArray = breakUp(array);
  const renderData = [];
  // перебираємо маси та перші 8 елементів пушимо в renderData
  for (let i = 0; i < array.length; i++) {
    if (!subArray[fetchNews.getPage()][i]) {
      continue;
    }
    renderData.push(subArray[fetchNews.getPage()][i]);
  }
  // створюємо строку розмітки
  const markUp = renderData.reduce((acc, el) => {
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
          <button id ='${
            el.id
          }' class="mybtn label-favorite">Add to favorite</button>
          </div>
        </div>
        <h2 class="news-card__info-title">${el.title.limit(50, {
          ending: '',
        })}</h2>
        <p class="news-card__info-text">${el.description.limit(120)}</p>
        <div class="news-card__additional">
          <p class="news-card__date">${el.pubDate}</p>
          <a class="news-card__more" href="${el.url}" id="${
      el.id
    }"target="_blank" rel="noreferrer noopener">Read more</a>
        </div>
      </div>`;
    return acc;
  }, ``);
  // додоємо створену розмітку в DOM

  gallery.insertAdjacentHTML('beforeend', markUp);
}

function breakUp(array) {
  const arr = [];
  for (let i = 0; i < array.length; i += 10) {
    arr.push(array.slice(i, i + 10));
  }
  return arr;
}

function element(totalPage, page) {
  let totalPages = totalPage;
  let liTag = '';
  let prevTag = '';
  let nextTag = '';
  let activeLi;
  let beforePages = page - 1;
  let afterPages = page + 1;

  if (totalPage > 50) {
    totalPages = 50;
  }
  if (totalPage < 2) {
    return;
  }
  // додаваня кнопки прев
  prevTag += `<div class="pagination_btn prev">
            <span class="material-symbols-outlined"> chevron_left</span>
            <span>Prev</span>
          </div>`;
  prevCon.innerHTML = prevTag;

  // коли відгортаєш далеко від початку, залишається видимою сторінка 1 і додаються "..." з початку
  if (page > 3) {
    liTag += `<li class="numb"><span>1</span></li> <li class="dots"><span>...</span></li>`;
  }

  // відображення сторінок якщо ти на самому початку
  if (page === totalPages) {
    beforePages = beforePages - 1;
  } else if (page === totalPages - 1) {
    // beforePages = beforePages - 1;
  }

  // відображення сторінок якщо ти на самому кінці
  if (page === 1) {
    afterPages = afterPages + 2;
  } else if (page === 2) {
    afterPages = afterPages + 1;
  }

  // відображення трьох сторінок посередині
  for (
    let pageLength = beforePages;
    pageLength <= afterPages;
    pageLength += 1
  ) {
    if (pageLength > totalPages) {
      continue;
    }
    if (pageLength === 0) {
      pageLength = pageLength + 1;
    }

    // підкреслює активну сторінку
    if (page === pageLength) {
      activeLi = 'active';
    } else {
      activeLi = '';
    }
    liTag += `<li class="numb ${activeLi}"><span class="pageLength">${pageLength}</span></li>`;
  }

  // додає "..." з кінця
  if (page < totalPages - 3) {
    if (page < totalPages - 2) {
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="numb"><span>${totalPages}</span></li>`;
  }

  // Додаваня кнопки некст
  nextTag += `<div class="pagination_btn next">
            <span>Next</span
            ><span class="material-symbols-outlined"> chevron_right </span>
          </div>`;
  nextCon.innerHTML = nextTag;
  itemCont.innerHTML = liTag;

  // Події кліку для перемикання сторінок по кнопці прев
  const prevBtn = document.querySelector('.prev');
  prevBtn.addEventListener('click', () => {
    if (page > 1) {
      element(totalPages, page - 1);
      return;
    }
  });

  // Події кліку для перемикання сторінок по кнопці некст
  const nextBtn = document.querySelector('.next');
  nextBtn.addEventListener('click', () => {
    if (page < totalPages) {
      element(totalPages, page + 1);
    }
  });

  // Події кліку для перемикання сторінок по самим цифрам
  const pageNumbers = document.querySelectorAll('.numb');
  const pageNumbersArray = Array.from(pageNumbers);

  for (const pageNumber of pageNumbersArray) {
    pageNumber.addEventListener('click', e => {
      const pageNumberValue = Number(e.target.textContent);
      element(totalPages, pageNumberValue);
    });
  }

  // логіка для неактивних кнопок
  nextCon.classList.remove('inactiveCon');
  if (page === 1) {
    prevBtn.classList.add('inactive');
    return;
  }
  if (page === totalPages) {
    nextBtn.classList.add('inactive');
    nextCon.classList.add('inactiveCon');

    return;
  }
  nextCon.classList.remove('inactiveCon');
}

function startPagination(totalPages) {
  const mediaQuery = window.matchMedia('(min-width: 768px)');
  function handleScreenSizeChange(e) {
    if (!e.matches) {
      deletePagination();
      elementMob(totalPages, fetchNews.page + 1);
      return;
    }

    deletePagination();
    element(totalPages, fetchNews.page + 1);
  }

  mediaQuery.addListener(handleScreenSizeChange);
  handleScreenSizeChange(mediaQuery);
}

export function deletePagination() {
  prevCon.innerHTML = '';
  nextCon.innerHTML = '';
  itemCont.innerHTML = '';
}

function elementMob(totalPag, page) {
  let liTag = '';
  let prevTag = '';
  let nextTag = '';
  let activeLi;
  let beforePages = page;
  let afterPages = page;
  let totalPages = totalPag;

  if (totalPages < 2) {
    return;
  }
  if (totalPages > 50) {
    totalPages = 50;
  }
  // додаваня кнопки прев
  prevTag += `<div class="pagination_btn prev">
            <span class="material-symbols-outlined"> chevron_left</span>
            <span>Prev</span>
          </div>`;
  prevCon.innerHTML = prevTag;

  // коли відгортаєш далеко від початку, залишається видимою сторінка 1 і додаються "..." з початку
  if (page > 1) {
    liTag += `<li class="numb"><span>1</span></li> <li class="dots"><span>...</span></li>`;
  }

  // відображення трьох сторінок посередині
  for (
    let pageLength = beforePages;
    pageLength <= afterPages;
    pageLength += 1
  ) {
    if (pageLength > totalPages) {
      continue;
    }
    if (pageLength === 0) {
      pageLength = pageLength + 1;
    }

    // підкреслює активну сторінку
    if (page === pageLength) {
      activeLi = 'active';
    } else {
      activeLi = '';
    }
    liTag += `<li class="numb ${activeLi}"><span class="pageLength">${pageLength}</span></li>`;
  }

  // додає "..." з кінця
  if (page < totalPages) {
    liTag += `<li class="dots"><span>...</span></li>`;

    liTag += `<li class="numb"><span>${totalPages}</span></li>`;
  }

  // Додаваня кнопки некст
  nextTag += `<div class="pagination_btn next">
            <span>Next</span
            ><span class="material-symbols-outlined"> chevron_right </span>
          </div>`;
  nextCon.innerHTML = nextTag;
  itemCont.innerHTML = liTag;

  // Події кліку для перемикання сторінок по кнопці прев
  const prevBtn = document.querySelector('.prev');
  prevBtn.addEventListener('click', () => {
    if (page > 1) {
      elementMob(totalPages, page - 1);
      return;
    }
  });

  // Події кліку для перемикання сторінок по кнопці некст
  const nextBtn = document.querySelector('.next');
  nextBtn.addEventListener('click', () => {
    if (page < totalPages) {
      elementMob(totalPages, page + 1);
    }
  });

  // Події кліку для перемикання сторінок по самим цифрам
  const pageNumbers = document.querySelectorAll('.numb');
  const pageNumbersArray = Array.from(pageNumbers);

  for (const pageNumber of pageNumbersArray) {
    pageNumber.addEventListener('click', e => {
      const pageNumberValue = Number(e.target.textContent);
      elementMob(totalPages, pageNumberValue);
    });
  }

  // логіка для неактивних кнопок
  if (page === 1) {
    prevBtn.classList.add('inactive');
    return;
  }
  if (page === totalPages) {
    nextBtn.classList.add('inactive');
    nextCon.classList.add('inactiveCon');

    return;
  }
  nextCon.classList.remove('inactiveCon');
}
