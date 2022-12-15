import _debounce from 'debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  box: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', _debounce(onFetch, DEBOUNCE_DELAY));

let searchCounties = '';

function onFetch(e) {
  searchCounties = e.target.value.trim();
  if (!searchCounties) {
    clearRender();
    return;
  }

  fetchCountries(searchCounties)
    .then(data => {
      if (data.length > 10) {
        clearRender();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length === 1) {
        clearRender();
        renderOneCountry(data);
        return;
      }
      clearRender();
      renderList(data);
    })
    .catch(error => {
      clearRender();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderList(countries) {
  const listMarkup = countries
    .map(({ flags, name }) => {
      return `<li class="country-list__item"><img src="${flags.svg}" alt="flag ${name.official}" width="50" ><p>${name.official}</p></li>`;
    })
    .join('');

  refs.list.insertAdjacentHTML('beforeend', listMarkup);
}

function renderOneCountry(country) {
  const { flags, name, capital, population, languages } = country[0];
  refs.box.innerHTML = `<div><img class="country-info__flag" src="${
    flags.svg
  }" alt="flag ${name.official}" width='70'>
  <p class="country-info__name" >${name.official}</p></div>
    <p class="country-info__text"><b>Capital: </b>${capital}</p>
    <p class="country-info__text"><b>Population: </b>${population}</p>
    <p class="country-info__text"><b>Languages: </b>${Object.values(
      languages
    )}</p>`;
}

function clearRender() {
  refs.list.innerHTML = '';
  refs.box.innerHTML = '';
}
