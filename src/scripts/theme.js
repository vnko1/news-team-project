const refs = {
  checkbox: document.getElementById('theme'),
  mobileMenu: document.querySelector('.menu-container'),
  lightLabel: document.querySelector('.light-label'),
  darkLabel: document.querySelector('.dark-label'),
  searchInput: document.querySelector('.search-input'),
  queryBtn: document.querySelector('.query-btn-icon'),
};

const savedTheme = localStorage.getItem('theme-site');

if (savedTheme) {
  document.body.classList.add(savedTheme + '-theme-site');
}

const savedCheckboxState = localStorage.getItem('theme-checkbox-state');

if (savedCheckboxState === 'true') {
  refs.checkbox.checked = true;
  document.body.classList.add('dark-theme-site');
  refs.lightLabel.classList.add('light-theme-site');
  refs.darkLabel.classList.add('dark-theme-site');
  refs.searchInput.classList.add('dark-theme-site');
  refs.queryBtn.classList.add('dark-theme-site');
  refs.mobileMenu.classList.add('dark-theme-site');
}

refs.checkbox.addEventListener('change', function () {
  document.body.classList.toggle('dark-theme-site');
  refs.lightLabel.classList.toggle('light-theme-site');
  refs.darkLabel.classList.toggle('dark-theme-site');
  refs.searchInput.classList.toggle('dark-theme-site');
  refs.queryBtn.classList.toggle('dark-theme-site');
  refs.mobileMenu.classList.toggle('dark-theme-site');
  changeTheme();
});

function changeTheme() {
  const theme = document.body.classList.contains('dark-theme-site')
    ? 'dark'
    : 'light';
  localStorage.setItem('theme', theme);
  localStorage.setItem('theme', theme);

  const checkboxState = refs.checkbox.checked;
  localStorage.setItem('theme-checkbox-state', checkboxState);
}
