import React, { useRef, useEffect } from 'react';
import { Flex, Spin, Alert } from 'antd';
import CardMovie from '../CardMovie/CardMovie.jsx';
import './MoviesList.css';

export default function MoviesList({
  loading,
  onInputChange,
  searchTerm,
  currentFilteredPosts,
  rateMovie,
  ratedMovies,
  genres,
  setMovies,
  setRatedMovies,
  activeTabKey
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  return (
    
    <>
      {loading ? (
        <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
          <Spin size="large" />
        </Flex>
      ) : (
        <>
           {activeTabKey === 'tab1' && ( 
            <div className="search-bar">
              <input
                className="search-bar-input"
                ref={inputRef}
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={onInputChange}
              />
            </div>
          )}
          <div className="movies-list">
            {currentFilteredPosts && currentFilteredPosts.length > 0 ? (
              currentFilteredPosts.map((movie) => (
                <CardMovie
                  key={movie.id}
                  movie={movie}
                  genres={genres}
                  rateMovie={rateMovie}
                  setMovies={setMovies}
                  setRatedMovies={setRatedMovies}
                />
              ))
            ) : activeTabKey === 'tab1' &&(
              <Alert message="I'm sorry :( No results found." type="info" />
            )}
          </div>
          {console.log(ratedMovies)}
          <div className="movies-list">
            {ratedMovies && ratedMovies.length > 0
              ? ratedMovies.map((movie) => (
                  <CardMovie
                    key={movie.id}
                    movie={movie}
                    genres={genres}
                    rateMovie={rateMovie}
                    setRatedMovies={setRatedMovies}
                  />
                ))
              : null}
          </div>
        </>
      )}
    </>
  );
}
