import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <App />
  </>
);

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTk4N2FlNDFjZDcxM2E3ZTc2ZTljMjA5ZDc5NWEyMSIsInN1YiI6IjY2MWE2YzU0NGU0ZGZmMDE3ZWQxYjAyMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.pzzvMjFN289kUf16q1V3VAqtAxW0gox5uRe2r9eQY5w',
  },
};
// export default class MovieService {
//   apiBase = 'https://api.themoviedb.org/3/trending/movie/day';
//   async getResource(url) {
//     const res = await fetch(`${this.apiBase}?language=en-US`, options);
//     if (!res.ok) {
//       throw new Error(`could not fetch ${url}` + `, received ${res.status}`);
//     }
//     return await res.json();
//   }
//   async getAllMovies() {
//     const response = await this.getResource('');
//     return response.results;
//   }
//   async getOneMovie(index) {
//     const movies = await this.getAllMovies();
//     const movie = movies[index];
//     if (!movie) {
//       throw new Error(`Movie not found at index ${index}`);
//     }
//     return movie;
//   }
// }
