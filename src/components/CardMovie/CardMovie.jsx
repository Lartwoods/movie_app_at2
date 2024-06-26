import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './CardMovie.css';
import MovieService from '../../services/MovieService.jsx';
import { Rate } from 'antd';

function shortenText(text, maxLength) {
  if (text <= maxLength) {
    return text;
  }
  const spaceIndex = text.lastIndexOf(' ', maxLength);
  if (!spaceIndex) {
    return text.slice(0, maxLength) + '...';
  } else {
    return text.slice(0, spaceIndex) + '...';
  }
}

export default function CardMovie({
  movie,
  genres,
  // rateMovie,
  setMovies,
  setRatedMovies,
}) {
  const { poster_path, original_title, release_date, genre_ids, overview } =
    movie;

  const formattedDate = format(new Date(release_date), 'dd MMMM yyyy');
  const shortText = shortenText(overview, 140);

  const genreNames = movie.genre_ids.map((id) => {
    const genre = genres.find((genre) => genre.id === id);
    return (
      <span className="genre-item" key={genre?.id || 0}>
        {genre ? genre.name : ''}
      </span>
    );
  });
  const voteAverage = movie.vote_average.toFixed(1);
  const getColor = (voteAverage) => {
    if (voteAverage >= 7) {
      return '#66E900';
    } else if (voteAverage >= 5) {
      return '#E9D100';
    } else if (voteAverage >= 3) {
      return '#E97E00';
    } else {
      return '#E90000';
    }
  };
  const ratingColor = getColor(voteAverage);
  const [rating, setRating] = useState(0);

  const handleRateChange = (value) => {
    // setMovies((prevMovies) => {
    //   return prevMovies.map((movie) => {
    //     // if (!movie || !movie.id) {
    //     //   return null;
    //     // }
    //     if (movie.id) {
    //       setRating({ ...movie, me_average: value });
    //       return { ...movie, me_average: value };
    //     }
    //     return movie;
    //   });
    // });
    // setRatedMovies((prevRatedMovies) => [...prevRatedMovies, movie]);
    // // setMovies((prevMovies) => {
    // //   return prevMovies.map((movie) => {
    // //     if (!movie || typeof movie.id === 'undefined') {
    // //       return null;
    // //     }
    // //     if (movie.id) {
    // //       setRating({ ...movie, me_average: value })
    // //       return { ...movie, me_average: value };
    // //     }
    // //     return movie;
    // //   });
    // // });

    // // rateMovie(movie.id, value);

    // setRating(value);
    localStorage.setItem(movie.id, value.toString());

    setMovies((prevMovies) => {
      return prevMovies.map((prevMovie) => {
        if (prevMovie.id === movie.id) {
          return { ...prevMovie, me_average: value };
        }
        return prevMovie;
      });
    });
    setRatedMovies((prevRatedMovies) => [...prevRatedMovies, movie]);
    setRating(value);
  };

  return (
    <div className="card-wrapper">
      <div className="card">
        <div
          className="rating-circle"
          style={{ border: `2px solid ${ratingColor}` }}
        >
          <div className="rating-value">{voteAverage}</div>
        </div>
        <img
          className="card-image"
          src={`https://image.tmdb.org/t/p/original${poster_path}`}
          alt={original_title}
        />
        <div className="card-details">
          <h2 className="card-title">{original_title}</h2>
          <p className="card-date">{formattedDate}</p>
          <p className="card-genre">{genreNames}</p>
          <p className="card-overview">{shortText}</p>
          <Rate
            allowHalf
            className="rate"
            count={10}
            defaultValue={0}
            value={rating}
            onChange={handleRateChange}
          />
        </div>
      </div>
    </div>
  );
}
