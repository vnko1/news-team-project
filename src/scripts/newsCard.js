import { getStorageList } from './commonFunctions';

const gallery = document.querySelector('.gallery-container');

if (localStorage.getItem('favourites') === null) {
  addEmptyArrtoStorage('favourites');
}

if (localStorage.getItem('read more') === null) {
  addEmptyArrtoStorage('read more');
}

gallery.addEventListener('click', onClick); // повесить слушателя на галерею

function onClick(event) {
  //--------------------Favourites--------------------------------
  if (event.target.tagName === 'BUTTON') {
    //label
    event.target.parentNode.children[0].classList.toggle(
      'js-favourite-storage'
    );

    if (event.target.parentNode.children[0].textContent === 'Add to favorite') {
      event.target.parentNode.children[0].textContent = 'Remove from favorite';
    } else if (
      event.target.parentNode.children[0].textContent === 'Remove from favorite'
    ) {
      event.target.parentNode.children[0].textContent = 'Add to favorite';
    }

    const arrayChildren = event.target.parentNode.parentNode.parentNode;

    const newObj = {
      id: arrayChildren.attributes[1].nodeValue,
      img: arrayChildren.children[0].children[1].src,
      alt: arrayChildren.children[0].children[1].alt,
      title: arrayChildren.children[1].textContent,
      descr: arrayChildren.children[2].textContent,
      dateArticle: arrayChildren.children[3].children[0].textContent,
      link: arrayChildren.children[3].children[1].href,
      category: arrayChildren.children[0].children[0].textContent,
    };

    const favouriteLinks = getStorageList('favourites');
    const myResult = favouriteLinks.some(object => object.id === newObj.id);

    refreshFavouritesStorage(myResult, favouriteLinks, newObj);
  }

  //--------------------Read more--------------------------------

  if (event.target.textContent === 'Read more') {
    // event.preventDefault();
    event.target.classList.add('js-read-more-storage');

    const arrayChildren = event.target.parentNode.parentNode;

    const newObj = {
      date: getDateForCreateObjToStorage(),
      id: arrayChildren.attributes[1].nodeValue,
      img: arrayChildren.children[0].children[1].src,
      alt: arrayChildren.children[0].children[1].alt,
      title: arrayChildren.children[1].textContent,
      descr: arrayChildren.children[2].textContent,
      dateArticle: arrayChildren.children[3].children[0].textContent,
      link: arrayChildren.children[3].children[1].href,
      category: arrayChildren.children[0].children[0].textContent,
    };

    const readMoreList = getStorageList('read more');
    const myResult = readMoreList.some(object => object.id === newObj.id);

    refreshLinkStorage(myResult, readMoreList, newObj);
  }
}

//================================================

function refreshLinkStorage(myResult, list, newObj) {
  if (!myResult) {
    list.push(newObj);
    localStorage.setItem('read more', JSON.stringify(list));
  } else {
    const linkIndex = list.findIndex(object => object.id === newObj.id);

    list.splice(linkIndex, 1);
    list.push(newObj);
    localStorage.setItem('read more', JSON.stringify(list));
  }
}

function refreshFavouritesStorage(myResult, list, newObj) {
  if (!myResult) {
    list.push(newObj);
    localStorage.setItem('favourites', JSON.stringify(list));
  } else {
    const linkIndex = list.findIndex(object => object.id === newObj.id);
    // console.log(linkIndex)
    list.splice(linkIndex, 1);
    localStorage.setItem('favourites', JSON.stringify(list));
  }
}

function addEmptyArrtoStorage(valueOfKeyStorage) {
  localStorage.setItem(valueOfKeyStorage, JSON.stringify([]));
}

function getDateForCreateObjToStorage() {
  const date = new Date();

  return date.getTime();
}
