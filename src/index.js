import './css/styles.css';
import debounce from 'lodash.debounce';
import countryFetch from './js/fetchCountries';
import countryCard from './template/landCard.hbs';
import countryList from './template/landList.hbs';
import './js/pnotify-cfg';
import { error } from '@pnotify/core';

const refs = {
  cardContainer: document.querySelector('.js-cardLand'),
  searchForm: document.querySelector('.js-searchForm'),
};

const renderCountryList = lands => {
  const markup = countryList(lands);
  refs.cardContainer.insertAdjacentHTML('beforeend', markup);
};

const renderCountryCard = land => {
  const markup = countryCard(land);
  refs.cardContainer.insertAdjacentHTML('beforeend', markup);
};

refs.searchForm.addEventListener('input', debounce(landSearch, 500));

function landSearch(event) {
  event.preventDefault();
  clearMarkup();

  const searchQuery = refs.searchForm.elements.query.value;

  countryFetch
    .fetchCountries(searchQuery)
    .then(landSucces)
    .catch(landError)
    .finally(clearMarkup());
}

function landSucces(data) {
  if (data.length === 1) {
    renderCountryCard(data);
    return;
  }
  if (data.length >= 2 && data.length <= 10) {
    renderCountryList(data);
    return;
  }
  landError();
  clearMarkup();
  return;
}

function landError() {
  error({
    text: 'Too many matches found. Please enter a more specific query!',
  });
}
function clearMarkup() {
  refs.cardContainer.innerHTML = '';
}
