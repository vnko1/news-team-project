import axios from 'axios';

const API_KEY = '6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';
const POPULAR_URL = 'https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json';
const SEARCH_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const FILTER_URL = 'https://api.nytimes.com/svc/news/v3/content/inyt/';
const CATEGORY_NAMES =
  'https://api.nytimes.com/svc/news/v3/content/section-list.json';
const limit = 500;

class FetchNews {
  constructor() {
    // дані прийшли з бекенду або з єкземпляру класу
    this.isUrlRequest = true;
    // масив, в якому зберігаються обʼєкти з обраними властивостями з бекенду. використовувати для рендеру і на кожному запиті його треба очищати
    this.data = [];
    // масив, в якому зберігаються обʼєкти з властивостями отриманими від бекенду. зберігаються всі додані з обраними властивостями з бекенду на поточній сесії.
    this.storageData = [];
    // масив в якому зберігаються дані бекенду по категоріям
    this.categoryData = [];
    // відфільтрований масив, в якому зберігаються обʼєкти з властивостями отриманими від бекенду. зберігаються всі додані з обраними властивостями з бекенду на поточній сесії.
    this.filtredStorageData = null;

    this.filterQuery = '';
    // параметр для фільтрації по даті
    this.filterParams = '';
    //  обрана в календарі дата
    this.date = '';
    // пошуковий параметр
    this.querySearch = '';

    this.filterQuery = '';
    // зберігається кількість знайдених новин
    this.hits = null;
    // лічильник, на всякий випадок для пагінації
    this.page = 0;

    this.totalPage = 0;
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
  //повертає масив даних
  getData() {
    return this.data;
  }
  // присвоює нове значення
  setData(newData) {
    this.data = newData;
  }
  // додає в масив обʼєкт з даними
  addData(data) {
    this.data.push(data);
  }
  // очищає масив з даними
  resetData() {
    this.data = [];
  }
  //повертає масив даних
  getCategoryData() {
    return this.categoryData;
  }
  // присвоює нове значення
  setCategoryData(newCategoryData) {
    this.categoryData = newCategoryData;
  }
  // додає в масив обʼєкт з даними
  addCategoryData(data) {
    this.categoryData.push(data);
  }
  // очищає масив з даними
  resetCategoryData() {
    this.categoryData = [];
  }
  // повертає масив всіх даних
  getStorageData() {
    return this.storageData;
  }
  // додає до масиву нові дані
  addStorageData(data) {
    this.storageData.push(data);
  }
  resetStorageData() {
    this.storageData = [];
  }
  // повертає масив відфільтрованих даних
  getFiltredStorageData() {
    return this.filtredStorageData;
  }
  // записує новий масив відфільтрованих даних
  setFiltredStorageData(newfiltredStorageData) {
    this.filtredStorageData = newfiltredStorageData;
  }
  addFiltredStorageData(data) {
    this.filtredStorageData.push(data);
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
  setDate(newDate) {
    this.date = newDate;
  }
  // повертає значення пошукового параметру
  getQuerySearch() {
    return this.querySearch;
  }
  // привоює нове значення пошуковуму параметру
  setQuerySearch(newQuerySearch) {
    this.querySearch = newQuerySearch;
  }
  // повертає значення пошукового параметру
  getFilterQuery() {
    return this.filterQuery;
  }
  // привоює нове значення пошуковуму параметру
  setFilterQuery(newQuery) {
    this.filterQuery = newQuery;
  }
  // повертає кілкьість знайдених новин
  getHits() {
    return this.hits;
  }
  // присвоює нове значення кількості знайдених новин
  setHits(newHits) {
    this.hits = newHits;
  }
  // повертає значення
  getPage() {
    return this.page;
  }
  // присвоює нове значення
  setPage(newPage) {
    this.page = newPage;
  }
  //обнуляє лічильник
  resetPage() {
    this.page = 0;
  }
  // додає лічильник
  incrementPage() {
    this.page += 1;
  }
  // зменшує лічильник
  decrementPage() {
    this.page -= 1;
    if (this.page < 0) this.resetPage();
  }
  // повертає значення
  getTotalPage() {
    return this.totalPage;
  }
  // присвоює нове значення
  setTotalPage(newTotalPage) {
    this.page = newTotalPage;
  }
  //обнуляє лічильник
  resetTotalPage() {
    this.page = 0;
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
  async fetchNewsByPopular() {
    //  обʼєкт параметрів для URL
    const params = new URLSearchParams({
      'api-key': API_KEY,
    });
    // зберігаємо URL
    this.setUrl(`${POPULAR_URL}?${params}`);
    this.setDateUrl(`${POPULAR_URL}?${params}`);

    const response = await axios.get(`${POPULAR_URL}?${params}`);

    // // повертає дані з бекенду
    return response;
  }

  async fetchNewsBySearch() {
    //  обʼєкт параметрів для URL
    let params = null;
    if (this.getDate()) {
      params = new URLSearchParams({
        q: this.getQuerySearch(),
        'api-key': API_KEY,
        begin_date: this.getDate(),
        end_date: this.getDate(),
      });
    } else {
      params = new URLSearchParams({
        q: this.getQuerySearch(),
        'api-key': API_KEY,
      });
    }
    // зберігаємо URL
    this.setUrl(`${SEARCH_URL}?${params}`);
    this.setDateUrl(`${SEARCH_URL}?q=${this.getQuerySearch()}`);
    // запит на бекенд
    const {
      data: { response },
    } = await axios.get(`${SEARCH_URL}?${params}`);

    return response;
  }

  async fetchNewsByDate() {
    //  обʼєкт параметрів для URL
    const params = new URLSearchParams({
      'api-key': API_KEY,
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

  async fetchNewsByFilter() {
    //  обʼєкт параметрів для URL
    const params = new URLSearchParams({
      'api-key': API_KEY,
      limit,
    });
    // зберігаємо URL
    this.setUrl(`${FILTER_URL}${this.getFilterQuery()}.json?${params}`);
    this.setDateUrl(`${FILTER_URL}${this.getFilterQuery()}.json?${params}`);

    const response = await axios.get(
      `${FILTER_URL}${this.getFilterQuery()}.json?${params}`
    );
    // // повертає дані з бекенду
    return response;
  }

  // повертає назви категорій з бекенду для подальшої фільтрації
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

  async fetchPagination() {
    const params = new URLSearchParams({ page: this.getPage() });
    const response = await axios.get(`${this.getUrl()}&${params}`);
    return response;
  }
}

export const fetchNews = new FetchNews();
