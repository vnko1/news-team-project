import axios from 'axios';

export default class WeatherApiService {
  constructor() {
    this.lat;
    this.lon;
  }

  async loadWeather() {
    if(this.lat === 0 && this.lon === 0) {
      const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=50.4333&lon=30.5167&appid=439d4b804bc8187953eb36d2a8c26a02`;
    } else {
      const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${this.lat}&lon=${this.lon}&appid=6c90b122891b52fe3b5fdb40f2e7657c`;

      const response = await axios.get(url);

      return response;
    }
    
  }
  async loadWeatherWeek() {

    if(this.lat == undefined || this.lon == undefined) {
      // const url = `https://openweathermap.org/data/2.5/onecall?lat=50.4333&lon=30.5167&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02`;;
    } else {
      const url = `https://openweathermap.org/data/2.5/onecall?lat=${this.lat}&lon=${this.lon}&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02`;
    
      const response = await axios.get(url);
  
      return response;
    }

  }
}
