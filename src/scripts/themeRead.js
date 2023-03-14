const refs = {
  checkbox: document.getElementById('theme'),
  mobileMenu: document.querySelector('.menu-container'),
  lightLabel: document.querySelector('.light-label'),
  darkLabel: document.querySelector('.dark-label'),
  iconSun: document.querySelector('.icon-sun'),
  iconMoon: document.querySelector('.icon-moon'),
  searchInput: document.querySelector('.search-input'),
  queryBtn: document.querySelector('.query-btn-icon'),
};
// перевірка локального сходице на наявність теми
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
  document.body.classList.add(savedTheme + '-theme-site');
}
// перевірка стану чекбокса
const savedCheckboxState = localStorage.getItem('theme-checkbox-state');

if (savedCheckboxState === 'true') {
  refs.checkbox.checked = true;
  document.body.classList.add('dark-theme-site');
  refs.lightLabel.classList.add('light-theme-site');
  refs.darkLabel.classList.add('dark-theme-site');
  refs.iconSun.classList.add('dark-theme-site');
  refs.iconMoon.classList.add('dark-theme-site');
  refs.searchInput.classList.add('dark-theme-site');
  refs.queryBtn.classList.add('dark-theme-site');
  refs.mobileMenu.classList.add('dark-theme-site');
}

refs.checkbox.addEventListener('change', function () {
  document.body.classList.toggle('dark-theme-site');
  refs.lightLabel.classList.toggle('light-theme-site');
  refs.darkLabel.classList.toggle('dark-theme-site');
  refs.iconSun.classList.toggle('dark-theme-site');
  refs.iconMoon.classList.toggle('dark-theme-site');
  refs.searchInput.classList.toggle('dark-theme-site');
  refs.queryBtn.classList.toggle('dark-theme-site');
  refs.mobileMenu.classList.toggle('dark-theme-site');
  changeThemeMobile();
});

function changeThemeMobile() {
  // перевірка класу на тегу body
  const theme = document.body.classList.contains('dark-theme-site')
    ? 'dark'
    : 'light';
  localStorage.setItem('theme', theme);

  // збереження стану чекбокса
  const checkboxState = refs.checkbox.checked;
  localStorage.setItem('theme-checkbox-state', checkboxState);
}
