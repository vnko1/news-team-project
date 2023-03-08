const homeLink = document.querySelector('.header-list__link.home');
const favLink = document.querySelector('.header-list__link.fav');
const readLink = document.querySelector('.header-list__link.read');

if (window.location.href.includes('index')) {
  homeLink.classList.add('header-list__link--current');
  favLink.classList.remove('header-list__link--current');
  readLink.classList.remove('header-list__link--current');
}
if (window.location.href.includes('favorite')) {
  homeLink.classList.remove('header-list__link--current');
  favLink.classList.add('header-list__link--current');
  readLink.classList.remove('header-list__link--current');
}
if (window.location.href.includes('read')) {
  homeLink.classList.remove('header-list__link--current');
  favLink.classList.remove('header-list__link--current');
  readLink.classList.add('header-list__link--current');
}
