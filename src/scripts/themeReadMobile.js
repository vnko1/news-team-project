const refs = {
  checkboxMobile: document.getElementById('mobile-theme'),
  mobileMenu: document.querySelector('.menu-container'),
  lightLabel: document.querySelector('.light-label'),
  darkLabel: document.querySelector('.dark-label'),
  iconSun: document.querySelector('.icon-sun-mob'),
  iconMoon: document.querySelector('.icon-moon-mob'),
  searchInput: document.querySelector('.search-input'),
  queryBtn: document.querySelector('.query-btn-icon'),
  menuIcon: document.querySelector('.menu-toggle__icons'),
  menuCross: document.querySelector('.menu-toggle__icons-cross'),
};

// перевірка локального сходице на наявність теми
const savedTheme = localStorage.getItem('theme-mobile');

if (savedTheme) {
  document.body.classList.add(savedTheme + '-theme-site');
}
// перевірка стану чекбокса
const savedCheckboxMobileState = localStorage.getItem(
  'theme-checkbox-state-mobile'
);

if (savedCheckboxMobileState === 'true') {
  refs.checkboxMobile.checked = true;
  document.body.classList.add('dark-theme-site');
  refs.lightLabel.classList.add('light-theme-site');
  refs.darkLabel.classList.add('dark-theme-site');
  refs.iconSun.classList.add('dark-theme-site');
  refs.iconMoon.classList.add('dark-theme-site');
  refs.searchInput.classList.add('dark-theme-site');
  refs.queryBtn.classList.add('dark-theme-site');
  refs.mobileMenu.classList.add('dark-theme-site');
  refs.menuIcon.classList.add('dark-theme-site');
  refs.menuCross.classList.add('dark-theme-site');
}

refs.checkboxMobile.addEventListener('change', function () {
  document.body.classList.toggle('dark-theme-site');
  refs.lightLabel.classList.toggle('light-theme-site');
  refs.darkLabel.classList.toggle('dark-theme-site');
  refs.searchInput.classList.toggle('dark-theme-site');
  refs.iconSun.classList.toggle('dark-theme-site');
  refs.iconMoon.classList.toggle('dark-theme-site');
  refs.queryBtn.classList.toggle('dark-theme-site');
  refs.mobileMenu.classList.toggle('dark-theme-site');
  refs.menuIcon.classList.toggle('dark-theme-site');
  refs.menuCross.classList.toggle('dark-theme-site');
  changeTheme();
});

function changeTheme() {
  // перевірка класу на тегу body
  const theme = document.body.classList.contains('dark-theme-site')
    ? 'dark'
    : 'light';
  localStorage.setItem('theme-mobile', theme);

  // збереження стану чекбокса
  const checkboxMobileState = refs.checkboxMobile.checked;
  localStorage.setItem('theme-checkbox-state-mobile', checkboxMobileState);
}
