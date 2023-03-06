import axios from 'axios';
import { fetchNews } from './FetchNews';

const loadBtn = document.getElementById('load');
const categoryContainer = document.querySelector('.filters .container');
const selectedList = document.querySelector('.js-select');
const filterCategory = document.querySelectorAll('.filters__button');
categoryContainer.addEventListener('click', onChooseCategoryBtn);
selectedList.addEventListener('click', onChooseCategoryFromSelect )

fetchCategoryNames();

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
  } 
}

function createSelectedList({ section, display_name }) {
  return `<option value="${section}">${display_name}</option>`;
}

function appendSelectedList(murkupForSelectedList) {
  selectedList.insertAdjacentHTML('afterbegin', murkupForSelectedList);
}


async function onChooseCategoryBtn (e) {
try{
  if(e.target.nodeName === "BUTTON") {
      const query = e.target.innerText;
     fetchNews.querySearch = query;
const response = await fetchNews.fetchNewsByCategory();
console.log('💛💙💪  response:', response);

}} catch (error) {
  console.error(error.message);
} 
}



async function onChooseCategoryFromSelect (e) {
try{
  if (e.target.nodeName === "SELECT") {
    console.log("search: ", e.target.value)
    const q = e.target.value;
     fetchNews.querySearch = q;
const secondResponse = await fetchNews.fetchNewsByCategory();
}} catch (error) {
  console.error(error.message);
} 
}