import axios from 'axios';

const loadBtn = document.getElementById('load');
const categoryContainer = document.querySelector('.filters .container');
console.log(categoryContainer);

loadBtn.addEventListener('click', onLoadClick);

function onLoadClick(e) {
  fetchCategories().finally(() => console.log('finally'));
}

async function getCategories() {
  const URL =
    'https://api.nytimes.com/svc/news/v3/content/section-list.json?api-key=6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';

  const response = await axios.get(URL);
  return response.data.results;
}

async function fetchCategories() {
  try {
    const categoryResults = await getCategories();
    const categoryWithShortName = categoryResults.filter(
      result => result.display_name.length <= 10
    );
    
    
    const murkup = categoryWithShortName.reduce(
      (murkup, result) => createElementForOneCategory(result) + murkup,
      ''
    );


    appendCategoryFilters(murkup);
  } catch (error) {
    console.error(error);
  }
}

function createElementForOneCategory({ section, display_name }) {
  return `<button type="button" class="js_filter-button" value='${section}' id="filter_">${display_name}</button>`;
}

function appendCategoryFilters(markup) {
  categoryContainer.insertAdjacentHTML('beforeend', markup);
}
