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
  console.log(movies);
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
      console.log(moviesData);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchMovies();
  }, []);
  useEffect(() => {
    const delayedFetchMovies = debounce(() => {
      fetchMovies();
    }, 500);
    delayedFetchMovies();
    return delayedFetchMovies.cancel;
  }, [debouncedSearchTerm, fetchMovies]);

  useEffect(() => {
    const initializeGuestSession = async () => {
      try {
        const movieService = new MovieService();
        const { guest_session_id } = await movieService.getQuestSession();
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
                ratedMovies={rateMovies}
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
          <MoviesList movies={rateMovies} />
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

// // import React, { useState, useEffect, useCallback } from 'react';
// // import { Alert, Space, Pagination } from 'antd';
// // import './App.css';
// // import MoviesList from './components/MoviesList/MoviesList.jsx';
// // import MovieService from './services/MovieService.jsx';
// // import { debounce } from 'lodash';

// // function App() {
// //   const [movies, setMovies] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [total, setTotal] = useState(0);
// //   const [page, setPage] = useState(1);
// //   const [postPerPage] = useState(6);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

// //   const fetchMovies = useCallback(async () => {
// //     try {
// //       if (!navigator.onLine) {
// //         throw new Error('No internet connection');
// //       }
// //       const movieService = new MovieService();
// //       const moviesData = await movieService.getAllMovies();
// //       setMovies(moviesData);
// //       setLoading(false);
// //       setTotal(moviesData.length);
// //     } catch (error) {
// //       setError(error);
// //       setLoading(false);
// //     }
// //   }, []);

// //   // useEffect(() => {
// //   //   fetchMovies();
// //   // }, [fetchMovies]);

// //   // const handleInputChange = useCallback(
// //   //   debounce((value) => {
// //   //     setSearchTerm(value);
// //   //   }, 500),
// //   //   []
// //   // );
// //   // const handleInputChange = (e) => {
// //   //   setSearchTerm(e.target.value);
// //   // };

// //   // const delayedFetchMovies = useCallback(
// //   //   debounce((searchTerm) => {
// //   //     fetchMovies(searchTerm);
// //   //   }, 500),
// //   //   [fetchMovies]
// //   // );

// //   // const handleInputChange = (event) => {
// //   //   const { value } = event.target;
// //   //   setSearchTerm(value);
// //   //   delayedFetchMovies(value);
// //   //   console.log(event.target.value)
// //   // };
// //   const delayedHandleInputChange = useCallback(
// //     debounce((value) => {
// //       console.log(value);
// //     }, 500),
// //     []
// //   );
// //   useEffect(() => {
// //     const delayedFetchMovies = debounce(fetchMovies, 500);
// //     delayedFetchMovies();
// //   }, [debouncedSearchTerm]);

// //   const handleInputChange = (event) => {
// //     const { value } = event.target;
// //     setSearchTerm(value);
// //     delayedHandleInputChange(value);
// //   };
// //   const filteredMovies = movies.filter((movie) =>
// //     movie?.title?.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   const indexOfLastPage = page * postPerPage;
// //   const indexOfFirstPage = indexOfLastPage - postPerPage;
// //   //   const currentPosts = movies.slice(indexOfFirstPage, indexOfLastPage);
// //   const currentFilteredPosts = filteredMovies.slice(
// //     indexOfFirstPage,
// //     indexOfLastPage
// //   );
// //   //   const totalPages = Math.ceil(currentFilteredPosts.length / postPerPage);

// //   return (
// //     <div className="App">
// //       {error ? (
// //         <Space
// //           className="custom-space"
// //           direction="vertical"
// //           style={{
// //             width: '100%',
// //           }}
// //         >
// //           <Alert message={errorMessage(error)} type="error" />
// //         </Space>
// //       ) : (
// //         <>
// //           <MoviesList
// //             // currentPosts={currentPosts}
// //             loading={loading}
// //             onInputChange={handleInputChange}
// //             searchTerm={searchTerm}
// //             movies={movies}
// //             currentFilteredPosts={currentFilteredPosts}
// //           />
// //           <Pagination
// //             className="custom-pagination"
// //             onChange={(value) => {
// //               setPage(value);
// //             }}
// //             total={total}
// //             current={page}
// //             pageSize={postPerPage}
// //             hideOnSinglePage
// //           />
// //         </>
// //       )}
// //     </div>
// //   );
// // }

// // function errorMessage(error) {
// //   if (error.message === 'No internet connection') {
// //     return 'No internet connection. Please check your network settings and try again.';
// //   } else {
// //     return "Well, this is awkward! Something's not quite right. Try to reload the page.";
// //   }
// // }

// // export default App;

// import React, { useState, useEffect, useCallback, createContext } from 'react';
// import { Alert, Space, Pagination, Spin, Tabs, Rate } from 'antd';
// import './App.css';
// import MoviesList from './components/MoviesList/MoviesList.jsx';
// import MovieService from './services/MovieService.jsx';
// import { debounce } from 'lodash';

// export const { Provider, Consumer } = React.createContext();

// export const GenresContext = createContext([]);

// function App() {
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [postPerPage] = useState(6);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
//   const [genres, setGenres] = useState([]);
//   const [movieRatings, setMovieRatings] = useState({});
//   const [rateMovies, setRatedMovies] = useState([]);

//   const fetchMovies = useCallback(async () => {
//     try {
//       if (!navigator.onLine) {
//         throw new Error('No internet connection');
//       }
//       const movieService = new MovieService();
//       const moviesData = await movieService.getAllMovies();
//       setMovies(moviesData);
//       setLoading(false);
//       setTotal(moviesData.length);
//       console.log(moviesData);
//     } catch (error) {
//       setError(error);
//       setLoading(false);
//     }
//   }, []);
//   // const rateMovie = (movieId, rating) => {
//   //   setMovieRatings((prevRatings) => ({
//   //     ...prevRatings,
//   //     [movieId]: rating,
//   //   }));
//   // };

//   useEffect(() => {
//     const initializeGuestSession = async () => {
//       try {
//         const movieService = new MovieService();
//         const { guest_session_id } = await movieService.getQuestSession();
//         movieService.setSessionToken(guest_session_id);
//       } catch (error) {
//         console.error('Error initializing guest session:', error);
//       }
//     };

//     initializeGuestSession();
//   }, []);
//   // useEffect(() => {
//   //   const loadRatedMovies = async () => {
//   //     try {
//   //       const movieService = new MovieService();
//   //       const ratedMoviesData = await movieService.getRatedMovies();
//   //       // Здесь вы можете обновить состояние, чтобы отразить полученные оцененные фильмы
//   //       // Например, сохранить их в состоянии ratedMovies
//   //       // setRatedMovies(ratedMoviesData.results);
//   //     } catch (error) {
//   //       console.error('Error loading rated movies:', error);
//   //     }
//   //   };

//   //   loadRatedMovies();
//   // }, []);
//   useEffect(() => {
//     const loadRatedMovies = async () => {
//       try {
//         const movieService = new MovieService();
//         const ratedMoviesData = await movieService.getRatedMovies();
//         setRatedMovies(ratedMoviesData.results);
//       } catch (error) {
//         console.error('Error loading rated movies:', error);
//       }
//     };

//     loadRatedMovies();
//   }, []);

//   const rateMovie = async (movieId, rating) => {
//     try {
//       const movieService = new MovieService();
//       await movieService.postMovieRating(movieId, rating);
//       // Обновите состояние, чтобы отразить, что фильм был оценен
//       // Например, обновите movieRatings
//       setMovieRatings((prevRatings) => ({
//         ...prevRatings,
//         [movieId]: rating,
//       }));
//     } catch (error) {
//       console.error('Error rating movie:', error);
//     }
//   };

//   useEffect(() => {
//     const fetchGenres = async () => {
//       try {
//         const movieService = new MovieService();
//         const genresData = await movieService.getGenres();
//         setGenres(genresData);
//         console.log(genresData);
//       } catch (error) {
//         console.error('Error loading genres:', error);
//       }
//     };

//     fetchGenres();
//   }, []);
//   useEffect(() => {
//     const delayedFetchMovies = debounce(() => {
//       fetchMovies();
//     }, 500);
//     delayedFetchMovies();
//     return delayedFetchMovies.cancel;
//   }, [debouncedSearchTerm, fetchMovies]);

//   const handleInputChange = (event) => {
//     const { value } = event.target;
//     setSearchTerm(value);
//     setDebouncedSearchTerm(value);
//   };

//   const filteredMovies = movies.filter((movie) =>
//     movie?.title?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastPage = page * postPerPage;
//   const indexOfFirstPage = indexOfLastPage - postPerPage;
//   const currentFilteredPosts = filteredMovies.slice(
//     indexOfFirstPage,
//     indexOfLastPage
//   );
//   // const onTabsChange = (active) => {
//   //   if (active === '2') {
//   //     loadRatedMovies(1)
//   //   }
//   //   if (active === '1') {
//   //     getDataMovies()
//   //   }
//   // }
//   const ratedMovies = movies.filter((movie) => movie.id in movieRatings);
//   const totalPageCount = Math.ceil(filteredMovies.length / postPerPage);
//   const items = [
//     {
//       key: 'tab1',
//       label: `Search`,
//       children: (
//         <>
//           {error ? (
//             <Space
//               className="custom-space"
//               direction="vertical"
//               style={{
//                 width: '100%',
//               }}
//             >
//               <Alert message={errorMessage(error)} type="error" />
//             </Space>
//           ) : (
//             <>
//               <MoviesList
//                 loading={loading}
//                 onInputChange={handleInputChange}
//                 searchTerm={searchTerm}
//                 movies={movies}
//                 currentFilteredPosts={currentFilteredPosts}
//                 genres={genres}
//                 rateMovie={rateMovie}
//                 ratedMovies={ratedMovies}
//               />
//               <Pagination
//                 className="custom-pagination"
//                 onChange={(value) => {
//                   setPage(value);
//                 }}
//                 total={filteredMovies.length}
//                 current={page}
//                 pageSize={postPerPage}
//                 hideOnSinglePage
//               />
//               {loading && <Spin />}
//             </>
//           )}
//         </>
//       ),
//     },
//     {
//       key: 'tab2',
//       label: `Rated`,
//       children: (
//         <>
//           {/* <MoviesList movies={ratedMovies} onRateMovie={rateMovie} /> */}
//           <MoviesList movies={ratedMovies} rateMovie={rateMovie} />
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="App">
//       <Tabs centered className="tabs" defaultActiveKey="tab1" items={items} />
//     </div>
//   );
// }

// function errorMessage(error) {
//   if (error.message === 'No internet connection') {
//     return 'No internet connection. Please check your network settings and try again.';
//   } else {
//     return "Well, this is awkward! Something's not quite right. Try to reload the page.";
//   }
// }

// export default App;
