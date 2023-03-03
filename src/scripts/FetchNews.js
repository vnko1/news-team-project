import axios from 'axios';

const API_KEY = '6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';
const BASE_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

class FetchNews {
  constructor() {
    this.data = [];
    this.storageData = [];
    this.date = null;
    this.querySearch = '';
    this.hits = null;
    this.counter = 0;
    this.url = '';
  }

  setData(newData) {
    this.data = newData;
  }

  addData(data) {
    this.data.push(data);
  }

  getData() {
    return this.data;
  }

  resetData() {
    this.data = [];
  }

  getStorageData() {
    return this.storageData;
  }

  addStorageData(data) {
    this.storageData.push(data);
  }

  setDate(newDate) {
    this.date = newDate;
  }

  getDate() {
    return this.date;
  }

  setQuerySearch(newQuerySearch) {
    this.querySearch = newQuerySearch;
  }

  getQuerySearch() {
    return this.querySearch;
  }

  getHits() {
    return this.hits;
  }

  setHits(newHits) {
    this.hits = newHits;
  }

  getCounter() {
    return this.counter;
  }

  updateCounter() {
    this.counter += 1;
  }

  resetCounter() {
    this.counter = 0;
  }

  getUrl() {
    return this.url;
  }

  setUrl(newUrl) {
    this.url = newUrl;
  }

  createObj(
    title = 'no data',
    description = 'no data',
    category = 'no data',
    pubDate = 'no data',
    url = 'no data',
    imgUrl,
    imgDescr = 'no data',
    id = 'no data'
  ) {
    console.log(imgUrl);
    const img = imgUrl
      ? `https://www.nytimes.com/${imgUrl}`
      : './src/images/logo.png';
    return { title, description, category, pubDate, url, img, imgDescr, id };
  }

  async fetchNewsByData() {
    const params = new URLSearchParams({
      'api-key': API_KEY,
      q: this.getQuerySearch(),
      begin_date: this.getDate(),
      end_date: this.getDate(),
    });
    this.setUrl(`${BASE_URL}?${params}`);
    const {
      data: { response },
    } = await axios.get(`${BASE_URL}?${params}`);

    return response;
  }
}

export const fetchNews = new FetchNews();
