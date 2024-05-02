import fetch from 'node-fetch';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  },
};

export default class MovieService {
  apiBase = 'https://api.themoviedb.org/3';
  apiKey = 'a1987ae41cd713a7e76e9c209d795a21';

  async getResource(url) {
    console.log(`${this.apiBase}${url}`);
    try {
      const res = await fetch(`${this.apiBase}${url}`, options);

      if (!res.ok) {
        throw new Error(`could not fetch ${url}` + `, received ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  async getAllMovies(page = 1) {
    'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
    try {
      const response = await this.getResource(
        `/discover/movie?api_key=${this.apiKey}&page=${page}`
      );
      return response.results;
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  async getGenres() {
    try {
      const response = await this.getResource(
        `/genre/movie/list?api_key=${this.apiKey}&language=en-US`
      );
      return response.genres;
    } catch (error) {
      console.error('Error loading genres:', error);
      throw error;
    }
  }

  async getGuestSession() {
    const data = await fetch(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`
    );
    return data.json();
  }

  async postMovieRating(movieId, rating) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Guest session token not available');
    }
    const data = await fetch(
      `${this.apiBase}/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          value: rating,
        }),
      }
    );
    return data.json();
  }

  async getRatedMovies(page = 1) {
    const token = localStorage.getItem('token');
    const data = await fetch(
      `${this.apiBase}/guest_session/${token}/rated/movies?api_key=${this.apiKey}`
    );
    return data.json();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setSessionToken(token) {
    localStorage.setItem('token', token);
  }
  setMyRating(id, value) {
    localStorage.setItem(id, value);
  }

  getMyRating(id) {
    return +localStorage.getItem(id);
  }
}
