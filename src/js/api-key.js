import axios from 'axios';

const KEY = '35498849-b2ea51a452a2f38037ac49000';

export { KEY };
// axios.defaults.baseURL = 'https://pixabay.com/api/';

// export const API_KEY = '35498849-b2ea51a452a2f38037ac49000';

// export class PixabayAPI {
//   #page = 1;
//   #per_page = 40;
//   #query = '';
//   #totalPages = 0;

//   async getPhotos(query, page, per_page) {
//     const params = {
//       page: this.#page,
//       q: this.#query,
//       per_page: this.#per_page,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//     };

//     const urlAXIOS = `?key=${API_KEY}`;

//     try {
//       const { data } = await axios.get(urlAXIOS, { params });
//       return data;
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         console.log('Error 404: Page not found');
//       } else {
//         console.log('Error', error.message);
//       }
//       throw error;
//     }
//   }

//   get query() {
//     this.#query;
//   }

//   set query(newQuery) {
//     this.#query = newQuery;
//   }

//   incrementPage() {
//     this.#page += 1;
//   }

//   resetPage() {
//     this.#page = 1;
//   }

//   setTotal(total) {
//     this.#totalPages = total;
//   }

//   hasMorePhotos() {
//     return this.#page < Math.ceil(this.#totalPages / this.#per_page);
//   }
// }
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Notify.failure('Something went wrong. Please try again later.');
    return Promise.reject(error);
  }
);

async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
}
