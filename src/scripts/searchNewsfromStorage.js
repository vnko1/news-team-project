import {getStorageList} from './commonFunctions'

const inputEl = document.querySelector('.search-input');
const formEl = document.getElementById('search-form');
const galleryEl = document.querySelector('.gallery-container');

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault()
console.log(e.target.elements)
}

// inputEl.addEventListener('change', inputChange)

// function inputChange(e) {
//   console.log(e)
// }

console.log(getStorageList)
const arr = getStorageList('favorite');
console.log(arr)

// arr.filter((obj)=>{

// })