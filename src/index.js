import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const URL_INFO = 'https://api.thecatapi.com/v1/breeds';
const URL_SEARCH = 'https://api.thecatapi.com/v1/images/search?breed_ids=';

axios.defaults.headers.common['x-api-key'] =
  'live_GZpvD2Uc7D7W8AkqAfEHOsBPPxeaP1cvsX4GvpMwIzLkXU7FiWxt1dutgdYkP08r';

const selectEl = new SlimSelect({
  select: '#selectElement',
  settings: {
    allowDeselect: true,
  },
  data: [{ placeholder: true, text: "Here search Cat's" }],
});

const ref = {
  select: document.querySelector('.selectEl'),
  loader_round: document.querySelector('.loader_cat'),
  loader_line: document.querySelector('.loader'),
};

fetchBreeds();

const refBtn = document.querySelector('button');
refBtn.addEventListener('click', onClick);

function onClick(e) {
  console.log(selectEl.getSelected());
}

function fetchBreeds() {
  axios
    .get(URL_INFO)
    .then(response => {
      const dataSlimSelect = [{ placeholder: true, text: "Here search Cat's" }];
      response.data.map(cat => dataSlimSelect.push({ text: cat.name }));
      selectEl.setData(dataSlimSelect);
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
