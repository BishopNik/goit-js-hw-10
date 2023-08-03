import axios from 'axios';
import { Report } from 'notiflix/build/notiflix-report-aio';
import selectSetData from './index';

const URL_INFO = 'https://api.thecatapi.com/v1/breeds';
const URL_SEARCH = 'https://api.thecatapi.com/v1/images/search?breed_ids=';

axios.defaults.headers.common['x-api-key'] =
  'live_GZpvD2Uc7D7W8AkqAfEHOsBPPxeaP1cvsX4GvpMwIzLkXU7FiWxt1dutgdYkP08r';

const ref = {
  select: document.querySelector('.selectEl'),
  loader_line: document.querySelector('.loader'),
  cat_container: document.querySelector('.cat-container'),
};

function fetchBreeds() {
  ref.cat_container.innerHTML = '';
  ref.select.classList.add('is-hidden');
  ref.loader_line.classList.remove('is-hidden');
  axios
    .get(URL_INFO)
    .then(response => {
      const dataSlimSelect = [{ placeholder: true, text: "Here search Cat's" }];
      response.data.map(cat => {
        dataSlimSelect.push({ text: cat.name, value: cat.id });
      });
      selectSetData(dataSlimSelect);
    })
    .catch(error => {
      Report.failure('Search Error', error.message, 'Okay');
      //   Notify.failure(error.message);
    })
    .finally(() => {
      ref.select.classList.remove('is-hidden');
      ref.loader_line.classList.add('is-hidden');
    });
}

function fetchCatByBreed(breedId) {
  return axios
    .get(`${URL_SEARCH}${breedId[0].value}`)
    .then(response => {
      const {
        url,
        breeds: [{ name, description, temperament, origin }],
      } = response.data[0];
      const dataForMarkUp = {
        url,
        name,
        description,
        temperament,
        origin,
      };
      return dataForMarkUp;
    })
    .catch(error => {
      throw new Error('Failed to fetch cat data: ' + error.message);
    });
}

export { fetchBreeds, fetchCatByBreed };
