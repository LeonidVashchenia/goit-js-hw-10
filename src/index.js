import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  searchForm: document.querySelector('#search-box'),
  listOfCountries: document.querySelector('.country-list'),
  infoBox: document.querySelector('.country-info'),
};

refs.searchForm.addEventListener(
  'input',
  debounce(onCheckInputValueTarget, DEBOUNCE_DELAY)
);

function onCheckInputValueTarget(e) {
  const inputValue = e.target.value.trim();
  if (inputValue === '') {
    onClearHTMLmarkup();
    return;
  }
  fetchCountries(inputValue)
    .then(counrtryName => onRenderMarkup(counrtryName))
    .catch(() => {
      onClearHTMLmarkup();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function onClearHTMLmarkup() {
  refs.listOfCountries.innerHTML = '';
  refs.infoBox.innerHTML = '';
}

function onRenderMarkup(counrtryName) {
  if (counrtryName.length > 10) {
    onCreateMaxCountries(counrtryName);
  }
  if (counrtryName.length === 1) {
    onCreateMarkupCountry(counrtryName);
  }
  if (counrtryName.length >= 2 && counrtryName.length <= 10) {
    onCreateMarkupListOfCountries(counrtryName);
  }
}

function onCreateMaxCountries(counrtryName) {
  console.log(counrtryName);
  onClearHTMLmarkup();
  return Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function onCreateMarkupCountry(counrtryName) {
  onClearHTMLmarkup();
  refs.listOfCountries.innerHTML = counrtryName
    .map(country => {
      return `<li class='country-list__item--bigger'><p class='country-list__text--bigger'><img class='country-list__image--bigger' src=${country.flags.svg}><b>${country.name.official}</b></p>`;
    })
    .join('');
  refs.infoBox.innerHTML = counrtryName
    .map(country => {
      return `<p><b>Capital:</b> ${country.capital}</p><p><b>Population:</b> ${
        country.population
      }</p><p><b>Languages:</b> ${Object.values(country.languages)}</p>`;
    })
    .join('');
}

function onCreateMarkupListOfCountries(counrtryName) {
  onClearHTMLmarkup();
  refs.listOfCountries.innerHTML = counrtryName
    .map(country => {
      return `<li class='country-list__item'><p class='country-list__text'><img class='country-list__image' src=${country.flags.svg}><b>${country.name.official}</b></p>`;
    })
    .join('');
}
