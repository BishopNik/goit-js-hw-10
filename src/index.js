import { Notify } from 'notiflix/build/notiflix-notify-aio';
import * as basicLightbox from 'basiclightbox';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const ref = {
  loader_round: document.querySelector('.loader_cat'),
  cat_container: document.querySelector('.cat-container'),
  btn_refresh: document.querySelector('.btn-refresh'),
};

const selectEl = new SlimSelect({
  select: '#selectElement',
  settings: {
    allowDeselect: true,
  },
  data: [{ placeholder: true, text: "Here search Cat's" }],
  events: {
    afterChange: newVal => {
      if (newVal.length === 0 || newVal[0].text === "Here search Cat's") {
        ref.cat_container.innerHTML = '';
        return;
      }
      ref.loader_round.classList.remove('is-hidden');
      fetchCatByBreed(newVal)
        .then(data => {
          markupCat(data);
          ref.loader_round.classList.add('is-hidden');
        })
        .catch(error => {
          Notify.failure(error.message);
          ref.loader_round.classList.add('is-hidden');
        });
    },
  },
});

ref.cat_container.addEventListener('click', onClickFullImageView);
ref.btn_refresh.addEventListener('click', fetchBreeds);

fetchBreeds();

function markupCat({ url, name, description, temperament, origin }) {
  const catElement = `<img src="${url}" alt="${name}" width="500">
        <div class="cat">
          <h1 class="cat-name">${name}</h1>
          <p class="cat-description">${description}</p>
          <p class="cat-temperament">Temperament: ${temperament}</p>
          <p class="cat-origin">Country: ${origin}</p>`;

  ref.cat_container.innerHTML = catElement;
}

function onClickFullImageView(e) {
  e.preventDefault();

  const isImgTeg = e.target.nodeName === 'IMG';

  if (!isImgTeg) {
    return;
  }

  const sourceClickedItem = e.target.src;
  const descriptionImg = e.target.alt;
  basicLightboxEl = basicLightbox.create(
    `
            <img
                src="${sourceClickedItem}"
                alt="${descriptionImg}"     
            />        
        `,
    {
      onClose: instance => {
        window.removeEventListener('keydown', onClickEsc);
      },
      onShow: instance => {
        window.addEventListener('keydown', onClickEsc);
      },
    }
  );
  basicLightboxEl.show();
}

function onClickEsc(evt) {
  const ESCAPE = 'Escape';
  const keyClicked = evt.key;

  if (keyClicked === ESCAPE) {
    basicLightboxEl.close();
  }
}

export default function selectSetData(data) {
  selectEl.setData(data);
}
