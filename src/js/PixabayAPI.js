import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const API_KEY = '35498849-b2ea51a452a2f38037ac49000';

export class PixabayAPI {
  #page = 1;
  #per_page = 40;
  #query = '';
  #totalPages = 0;

  async getPhotos() {
    const params = {
      page: this.#page,
      q: this.#query,
      per_page: this.#per_page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    };

    const urlAXIOS = `?key=${API_KEY}`;

    try {
      const { data } = await axios.get(urlAXIOS, { params });
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('Error 404: Page not found');
      } else {
        console.log('Error', error.message);
      }
      throw error;
    }
  }

  get query() {
    this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  setTotal(total) {
    this.#totalPages = total;
  }

  hasMorePhotos() {
    return this.#page < Math.ceil(this.#totalPages / this.#per_page);
  }
}
