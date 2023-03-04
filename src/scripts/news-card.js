import {getStorageList} from './CommonFunctions'


// Вставить после рендера страницы
if (localStorage.getItem("favourites") === null) {
  addEmptyArrtoStorage("favourites");
}

if (localStorage.getItem("Read more") === null) {
  addEmptyArrtoStorage("Read more");
}

// gallery.addEventListener("click", onClick); // повесить слушателя на галерею

function onClick(event) {
  //--------------------Favourites--------------------------------
  if (event.target.type === "checkbox") {
// console.dir(event.target.parentNode.children[0])
    event.target.parentNode.children[0].classList.toggle("js-favourite-storage");

    const arrayChildren = event.target.parentNode.parentNode.parentNode;
    console.dir(arrayChildren.children[0].children[1].src)
    // console.dir(arrayChildren)

    const newObj = {
      id: arrayChildren.attributes[1].nodeValue,
      img: arrayChildren.children[0].children[1].src,
      title: arrayChildren.children[1].textContent,
      descr: arrayChildren.children[2].textContent,
      dateArticle: arrayChildren.children[3].children[0].textContent,
      link: arrayChildren.children[3].children[1].href,
    };

    const favouriteLinks = getStorageList("favourites");
    const myResult = favouriteLinks.some((object) => object.id === newObj.id);

    refreshFavouritesStorage(myResult, favouriteLinks, newObj);
  }

  //--------------------Read more--------------------------------
  
  if (event.target.textContent === "Read more") {
    // event.preventDefault();
    event.target.classList.add("js-read-more-storage");

    const arrayChildren = event.target.parentNode.parentNode;
    
    const newObj = {
      date: getDateForCreateObjToStorage(),
      id: arrayChildren.attributes[1].nodeValue,
      img: arrayChildren.children[0].children[1].src,
      title: arrayChildren.children[1].textContent,
      descr: arrayChildren.children[2].textContent,
      dateArticle: arrayChildren.children[3].children[0].textContent,
      link: arrayChildren.children[3].children[1].href,
    };

    const readMoreList = getStorageList("read more");
    const myResult = readMoreList.some((object) => object.id === newObj.id);

    refreshLinkStorage(myResult, readMoreList, newObj);
  }
}

//================================================

function refreshLinkStorage(myResult, list, newObj) {
  if (!myResult) {
    list.push(newObj);
    localStorage.setItem("read more", JSON.stringify(list));
  } else {
    const linkIndex = list.findIndex((object) => object.id === newObj.id);

    list.splice(linkIndex, 1);
    list.push(newObj);
    localStorage.setItem("read more", JSON.stringify(list));
  }
}

function refreshFavouritesStorage(myResult, list, newObj) {
  if (!myResult) {
    list.push(newObj);
    localStorage.setItem("favourites", JSON.stringify(list));
  } else {
    
    const linkIndex = list.findIndex((object) => object.id === newObj.id);
    
    list.splice(linkIndex, 1);
    localStorage.setItem("favourites", JSON.stringify(list));
  }
}

function addEmptyArrtoStorage(valueOfKeyStorage) {
  localStorage.setItem(valueOfKeyStorage, JSON.stringify([]));
}

// function getStorageList(valueOfKeyStorage) {
//   return JSON.parse(localStorage.getItem(valueOfKeyStorage));
// }

function getDateForCreateObjToStorage() {
  const date = new Date()
  // return new Date();
  return `${String(date.getDate()).padStart(2, 0)}/${String(date.getMonth() + 1).padStart(2, 0)}/${String(date.getFullYear())}`;
}