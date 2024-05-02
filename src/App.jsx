import React, { useState, useEffect, useCallback, createContext } from 'react';
import { Alert, Space, Pagination, Spin, Tabs } from 'antd';
import './App.css';
import MoviesList from './components/MoviesList/MoviesList.jsx';
import MovieService from './services/MovieService.jsx';
import { debounce } from 'lodash';

export const { Provider, Consumer } = React.createContext();

export const GenresContext = createContext([]);

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [postPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [genres, setGenres] = useState([]);
  const [movieRatings, setMovieRatings] = useState({});
  const [rateMovies, setRatedMovies] = useState([]);
  const [activeTabKey, setActiveTabKey] = useState('tab1');

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };
  // console.log(movies);
  const fetchMovies = useCallback(async () => {
    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }
      const movieService = new MovieService();
      const moviesData = await movieService.getAllMovies();
      setMovies(moviesData);
      setLoading(false);
      setTotal(moviesData.length);
      // console.log(moviesData);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  const delayedFetchMovies = debounce(fetchMovies, 600);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    delayedFetchMovies.flush();
    delayedFetchMovies();
    console.log('ggddddddddddddddddd');

    // return delayedFetchMovies.cancel;
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const initializeGuestSession = async () => {
      try {
        const movieService = new MovieService();
        const { guest_session_id } = await movieService.getGuestSession();
        movieService.setSessionToken(guest_session_id);
      } catch (error) {
        console.error('Error initializing guest session:', error);
      }
    };

    initializeGuestSession();
  }, []);

  // useEffect(() => {
  //   const loadRatedMovies = async () => {
  //     try {
  //       const movieService = new MovieService();
  //       const ratedMoviesData = await movieService.getRatedMovies();
  //       setRatedMovies(ratedMoviesData.results);
  //     } catch (error) {
  //       console.error('Error loading rated movies:', error);
  //     }
  //   };

  //   loadRatedMovies();
  // }, []);

  const rateMovie = async (movieId, rating) => {
    try {
      const movieService = new MovieService();
      const token = movieService.getToken();
      if (!token) {
        throw new Error('Guest session token not available');
      }
      await movieService.postMovieRating(movieId, rating);
      setMovieRatings((prevRatings) => ({
        ...prevRatings,
        [movieId]: rating,
      }));
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const movieService = new MovieService();
        const genresData = await movieService.getGenres();
        setGenres(genresData);
        console.log(genresData);
      } catch (error) {
        console.error('Error loading genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setDebouncedSearchTerm(value);
  };

  const filteredMovies = movies.filter((movie) =>
    movie?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPage = page * postPerPage;
  const indexOfFirstPage = indexOfLastPage - postPerPage;
  const currentFilteredPosts = filteredMovies.slice(
    indexOfFirstPage,
    indexOfLastPage
  );

  const totalPageCount = Math.ceil(filteredMovies.length / postPerPage);

  const items = [
    {
      key: 'tab1',
      label: `Search`,
      children: (
        <>
          {error ? (
            <Space
              className="custom-space"
              direction="vertical"
              style={{
                width: '100%',
              }}
            >
              <Alert message={errorMessage(error)} type="error" />
            </Space>
          ) : (
            <>
              <MoviesList
                loading={loading}
                onInputChange={handleInputChange}
                searchTerm={searchTerm}
                movies={movies}
                currentFilteredPosts={currentFilteredPosts}
                genres={genres}
                rateMovie={rateMovie}
                setMovies={setMovies}
                // ratedMovies={rateMovies}
                setRatedMovies={setRatedMovies}
                activeTabKey={activeTabKey}
              />
              <Pagination
                className="custom-pagination"
                onChange={(value) => {
                  setPage(value);
                }}
                total={filteredMovies.length}
                current={page}
                pageSize={postPerPage}
                hideOnSinglePage
              />
              {loading && <Spin />}
            </>
          )}
        </>
      ),
    },
    {
      key: 'tab2',
      label: `Rated`,
      children: (
        <>
          <MoviesList
            movies={rateMovies}
            setRatedMovies={setRatedMovies}
            ratedMovies={rateMovies}
            genres={genres}
          />
        </>
      ),
    },
  ];

  return (
    <div className="App">
      <Tabs centered className="tabs" defaultActiveKey="tab1" items={items} />
    </div>
  );
}

function errorMessage(error) {
  if (error.message === 'No internet connection') {
    return 'No internet connection. Please check your network settings and try again.';
  } else {
    return "Well, this is awkward! Something's not quite right. Try to reload the page.";
  }
}

export default App;
