import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createMarkup } from './js/createMarkup';
import { PixabayAPI } from './js/PixabayAPI';
import { refs } from './js/refs';
import { notifyInit } from './js/notifyInit';

const modalLightboxGallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

refs.btnLoadMore.classList.add('is-hidden');

const pixaby = new PixabayAPI();

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

const loadMorePhotos = async function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      pixaby.incrementPage();

      try {
        const { hits } = await pixaby.getPhotos();
        const markup = createMarkup(hits);
        refs.gallery.insertAdjacentHTML('beforeend', markup);

        if (pixaby.hasMorePhotos) {
          const lastItem = document.querySelector('.gallery a:last-child');
          observer.observe(lastItem);
        } else {
          Notify.info(
            "We're sorry, but you've reached the end of search results.",
            notifyInit
          );
          const lastItem = document.querySelector('.gallery a:last-child');
          observer.unobserve(lastItem);
        }

        modalLightboxGallery.refresh();
        scrollPage();
      } catch (error) {
        clearPage();
      } finally {
      }
    }
  });
};

const observer = new IntersectionObserver(loadMorePhotos, options);

const onSubmitClick = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.target;

  const search_query = searchQuery.value.trim().toLowerCase();

  if (!search_query) {
    clearPage();
    Notify.info('Enter data to search!', notifyInit);

    refs.searchInput.placeholder = 'What`re we looking for?';
    return;
  }

  pixaby.query = search_query;

  clearPage();

  try {
    const { hits, total } = await pixaby.getPhotos();

    if (hits.length === 0) {
      Notify.failure(
        `Sorry, there are no images matching your ${search_query}. Please try again.`,
        notifyInit
      );

      return;
    }

    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    pixaby.setTotal(total);
    Notify.success(`Hooray! We found ${total} images.`, notifyInit);

    if (pixaby.hasMorePhotos) {
      const lastItem = document.querySelector('.gallery a:last-child');
      observer.observe(lastItem);
    }

    modalLightboxGallery.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!', notifyInit);

    clearPage();
  } finally {
  }
};

const onLoadMore = async () => {
  pixaby.incrementPage();

  if (!pixaby.hasMorePhotos) {
    refs.btnLoadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
    notifyInit;
  }
  try {
    const { hits } = await pixaby.getPhotos();
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    modalLightboxGallery.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!', notifyInit);

    clearPage();
  }
};

function clearPage() {
  pixaby.resetPage();
  refs.gallery.innerHTML = '';
  refs.btnLoadMore.classList.add('is-hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

refs.form.addEventListener('submit', onSubmitClick);
refs.btnLoadMore.addEventListener('click', onLoadMore);

function scrollPage() {
  const photoGalleryEl = document.querySelector('.gallery');
  if (photoGalleryEl > total) {
    window.removeEventListener('scroll', scrollFunction);
    return;
  }

  const { height: cardHeight } =
    photoGalleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

window.addEventListener('scroll', scrollFunction);

function scrollFunction() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    refs.btnUpWrapper.style.display = 'flex';
  } else {
    refs.btnUpWrapper.style.display = 'none';
  }
}

refs.btnUp.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
