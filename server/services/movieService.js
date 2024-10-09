const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.API_KEY;

const movieService = {
    searchMovieByTitle: async (title) => {
        try {
            const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
                params: {
                    api_key: apiKey,
                    query: title,
                    language: 'en-US'
                }
            });
            return response.data.results.map(movie => ({
                movieId: movie.id,
                title: movie.title,
                year: new Date(movie.release_date).getFullYear(),
                description: movie.overview,
                TMDbRating: movie.vote_average,
                poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null // Construct the full poster URL
            }));
        } catch (error) {
            throw new Error('Error searching movie by title');
        }
    },

    getMovieDetails: async (movieId) => {
        try {
          const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
              api_key: apiKey,
              append_to_response: 'credits,videos'
            }
          });
          
          const movie = response.data;
          const credits = movie.credits.crew;
          const cast = movie.credits.cast.slice(0, 8);  // Limit the number of actors
    
          // Get director(s) and writer(s)
          const directors = credits.filter(member => member.job === 'Director').map(director => director.name);
          const directorPicture = credits.find(member => member.job === 'Director')?.profile_path;
          const writers = credits.filter(member => member.job === 'Writer' || member.department === 'Writing').map(writer => writer.name);
    
          // Get cast with headshots
          const castWithPictures = cast.map(actor => ({
            id: actor.id,
            name: actor.name,
            character: actor.character,
            picture: actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : null
          }));
    
          return {
            movieId: movie.id,
            title: movie.title,
            director: directors.join(', '),
            directorPicture: directorPicture ? `https://image.tmdb.org/t/p/w200${directorPicture}` : null,
            writers: writers.join(', '),
            year: new Date(movie.release_date).getFullYear(),
            runtime: movie.runtime,
            description: movie.overview,
            TMDbRating: movie.vote_average,
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            genres: movie.genres.map(genre => genre.name),
            cast: castWithPictures,
            language: movie.original_language 
          };
        } catch (error) {
          throw new Error('Error fetching movie details');
        }
    },

    getMovieBasicInfo: async (movieId) => {
      try {
          const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
              params: {
                  api_key: apiKey
              }
          });
          
          const movie = response.data;
          
          return {
              title: movie.title,
              poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
              year: new Date(movie.release_date).getFullYear()
          };
      } catch (error) {
          throw new Error('Error fetching movie basic info');
      }
  }
};

module.exports = movieService;



