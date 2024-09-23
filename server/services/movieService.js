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
                    append_to_response: 'credits'
                }
            });
            
            const movie = response.data;
            const credits = movie.credits.crew;

            // Get director(s) and writer(s) from credits using filtering
            const directors = credits.filter(member => member.job === 'Director').map(director => director.name);
            const writers = credits.filter(member => member.job === 'Writer' || member.department === 'Writing').map(writer => writer.name);

            return {
                movieId: movie.id,
                title: movie.title,
                director: directors.join(', '), 
                writers: writers.join(', '),
                year: new Date(movie.release_date).getFullYear(),
                runtime: movie.runtime,
                description: movie.overview,
                TMDbRating: movie.vote_average,
                poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null 
            };
        } catch (error) {
            throw new Error('Error fetching movie details');
        }
    }  
};

module.exports = movieService;



