import axios from 'axios';

const API_KEY = '6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY';
const BASE_URL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';

class FetchNews {
  constructor() {
    this.data = null;
    this.date = null;
    this.querySearch = '';
  }

  setData(newData) {
    this.data = newData;
  }

  getData() {
    return this.data;
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

  async fetchNews() {
    const params = new URLSearchParams({
      'api-key': API_KEY,
      q: this.getQuerySearch(),
      begin_date: this.getDate(),
      end_date: this.getDate(),
    });
    console.log(`${BASE_URL}?${params}`);
    const {
      data: { response },
    } = await axios.get(`${BASE_URL}?${params}`);

    return response;
  }
}

export const fetchNews = new FetchNews();
