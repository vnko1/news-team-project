import axios from 'axios';

const API_KEY = '6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';
const SEARCH_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const CATEGORY_NAMES = 'https://api.nytimes.com/svc/news/v3/content/section-list.json';
const SEARCH_BY_CATEGORIES = 'https://api.nytimes.com/svc/news/v3/content/nyt/arts.json?'

class FetchNews {
  constructor() {
    // дані прийшли з бекенду або з єкземпляру класу
    this.isUrlRequest = true;
    // масив, в якому зберігаються обʼєкти з обраними властивостями з бекенду. використовувати для рендеру і на кожному запиті його треба очищати
    this.data = [];
    // масив, в якому зберігаються обʼєкти з властивостями отриманими від бекенду. зберігаються всі додані з обраними властивостями з бекенду на поточній сесії.
    this.storageData = [];
    // відфільтрований масив, в якому зберігаються обʼєкти з властивостями отриманими від бекенду. зберігаються всі додані з обраними властивостями з бекенду на поточній сесії.
    this.filtredStorageData = null;
    // параметр для фільтрації по даті
    this.filterParams = '';
    //  обрана в календарі дата
    this.date = '';
    // пошуковий параметр
    this.querySearch = '';
    // зберігається кількість знайдених новин
    this.hits = null;
    // лічильник, на всякий випадок для пагінації
    this.counter = 0;
    // URL запиту на бекенд з усіма параметрами (потрібен для пагінації)
    this.url = '';
    // URL запиту на бекенд з усіма параметрами (для фільтрації зв датою)
    this.dateUrl = '';
    // буде зберігатись колекція елементів картки новин
    this.nodeChild = null;
  }
  // повертає булеве значення про те чи дані прийшли з бекенду або  з єкземпляру класу
  getIsUrlRequest() {
    return this.isUrlRequest;
  }
  // змінює булеве значення
  setIsUrlRequest(newUrlRequest) {
    this.isUrlRequest = newUrlRequest;
  }
  // присвоює нове значення
  setData(newData) {
    this.data = newData;
  }
  // додає в масив обʼєкт з даними
  addData(data) {
    this.data.push(data);
  }
  //повертає масив даних
  getData() {
    return this.data;
  }
  // очищає масив з даними
  resetData() {
    this.data = [];
  }
  // повертає масив всіх даних
  getStorageData() {
    return this.storageData;
  }
  // додає до масиву нові дані
  addStorageData(data) {
    this.storageData.push(data);
  }
  // повертає масив відфільтрованих даних
  getFiltredStorageData() {
    return this.filtredStorageData;
  }
  // записує новий масив відфільтрованих даних
  setFiltredStorageData(newfiltredStorageData) {
    this.filtredStorageData = newfiltredStorageData;
  }
  //повертає параметр для фільтрації по даті
  getFilterParams() {
    return this.filterParams;
  }
  // присвоює новий параметр для фільтрації по даті
  setFilterParams(newFilterParams) {
    this.filterParams = newFilterParams;
  }
  // повертає дату
  getDate() {
    return this.date;
  }
  // присвоює нове значення даті
  setDate(newDate) {
    this.date = newDate;
  }
  // скидає дату
  resetDate() {
    this.date = '';
  }
  // повертає значення пошукового параметру
  getQuerySearch() {
    return this.querySearch;
  }
  // привоює нове значення пошуковуму параметру
  setQuerySearch(newQuerySearch) {
    this.querySearch = newQuerySearch;
  }
  // повертає кілкьість знайдених новин
  getHits() {
    return this.hits;
  }
  // присвоює нове значення кількості знайдених новин
  setHits(newHits) {
    this.hits = newHits;
  }
  // повертає лічильник
  getCounter() {
    return this.counter;
  }
  // оновлює лічильник
  updateCounter() {
    this.counter += 1;
  }
  //обнуляє лічильник
  resetCounter() {
    this.counter = 0;
  }
  // повертає URL (потрібен для пагінації)
  getUrl() {
    return this.url;
  }
  // присвоює нове значення URL (потрібен для пагінації)
  setUrl(newUrl) {
    this.url = newUrl;
  }

  // повертає дату
  getDateUrl() {
    return this.dateUrl;
  }
  setDateUrl(newDateUrl) {
    this.dateUrl = newDateUrl;
  }
  resetDateUrl() {
    this.dateUrl = '';
  }
  // повертає масив елементів з селектором .news-card
  getNodeChild() {
    return this.nodeChild;
  }
  // записує масив елементів
  setNodeChild(newNode) {
    this.nodeChild = newNode;
  }
  // метод запиту на бекенд
  async fetchNewsByDate() {
    //  обʼєкт параметрів для URL
    const params = new URLSearchParams({
      begin_date: this.getDate(),
      end_date: this.getDate(),
      // 'api-key': API_KEY,
    });
    // зберігаємо URL
    this.setUrl(`${this.getDateUrl()}&${params}`);
    // запит на бекенд
    const response = await axios.get(`${this.getDateUrl()}&${params}`);
    // повертає дані з бекенду
    return response;
  }

  async fetchNewsBySearch() {
    //  обʼєкт параметрів для URL
    const params = new URLSearchParams({
      q: this.getQuerySearch(),
      'api-key': API_KEY,
    });
    // зберігаємо URL
    this.setUrl(`${SEARCH_URL}?${params}`);
    this.setDateUrl(`${SEARCH_URL}?${params}`);
    // запит на бекенд
    const {
      data: { response },
    } = await axios.get(`${SEARCH_URL}?${params}`);
    return response;
  }


  async getCategoryNames() {
    //  обʼєкт параметрів для URL
    const params = new URLSearchParams({
       'api-key': API_KEY,
    });    
    // запит на бекенд
    const response = await axios.get(`${CATEGORY_NAMES}?${params}`);
    // повертає назви категорій з бекенду
    return response.data.results;
  }


async fetchNewsByCategory() {
    //  обʼєкт параметрів для URL
    const params = new URLSearchParams({
      // q: this.getQuerySearch(),
      'api-key': API_KEY,
    });
    this.setQuerySearch('arts');
    // зберігаємо URL
    this.setUrl(`'https://api.nytimes.com/svc/news/v3/content/nyt/${this.querySearch}.json?${params}'`);
    this.setDateUrl(`'https://api.nytimes.com/svc/news/v3/content/nyt/${this.querySearch}.json?${params}'`);
    // // запит на бекенд
      const {
      data: { response },
    } = await axios.get(`'https://api.nytimes.com/svc/news/v3/content/nyt/${this.querySearch}.json?${params}'`);
    return response;
  }
}



export const fetchNews = new FetchNews();
