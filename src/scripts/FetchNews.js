import axios from 'axios';

const API_KEY = '6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';
const SEARCH_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

class FetchNews {
  constructor() {
    // масив, в якому зберігаються обʼєкти з обраними властивостями з бекенду. використовувати для рендеру і на кожному запиті його треба очищати
    this.data = [];
    // масив, в якому зберігаються обʼєкти з властивостями отриманими від бекенду. зберігаються всі одані з обраними властивостями з бекенду на поточній сесії. Але фактично, він не потрібен.
    this.storageData = [];
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
  // повертає масив елементів з селектором .news-card
  getNodeChild() {
    return this.nodeChild;
  }
  // записує масив елементів
  setNodeChild(newNode) {
    this.nodeChild = newNode;
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
  // очищає масив
  resetData() {
    this.data = [];
  }
  // не потрібен
  getStorageData() {
    return this.storageData;
  }
  // не потрібен
  addStorageData(data) {
    this.storageData.push(data);
  }
  // присвоює нове значення даті
  setDate(newDate) {
    this.date = newDate;
  }
  // повертає дату
  getDate() {
    return this.date;
  }
  resetDate() {
    this.date = '';
  }
  // привоює нове значення пошуковуму параметру
  setQuerySearch(newQuerySearch) {
    this.querySearch = newQuerySearch;
  }
  // повертає значення пошукового параметру
  getQuerySearch() {
    return this.querySearch;
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

  setDateUrl(newDateUrl) {
    this.dateUrl = newDateUrl;
  }
  // повертає дату
  getDateUrl() {
    return this.dateUrl;
  }

  resetDateUrl() {
    this.dateUrl = '';
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
}

export const fetchNews = new FetchNews();
