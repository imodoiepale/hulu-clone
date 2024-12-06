const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const requests = {
  fetchTrending: {
    title: 'Trending',
    url: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  },
  fetchTopRated: {
    title: 'Top Rated',
    url: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  },
  fetchActionMovies: {
    title: 'Action',
    url: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  },
  fetchComedyMovies: {
    title: 'Comedy',
    url: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  },
  fetchHorrorMovies: {
    title: 'Horror',
    url: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  },
  fetchRomanceMovies: {
    title: 'Romance',
    url: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  },
  fetchDocumentaries: {
    title: 'Documentaries',
    url: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  },
};

export type Genre = keyof typeof requests;

export async function fetchMovies(genre: Genre) {
  const response = await fetch(`https://api.themoviedb.org/3${requests[genre].url}`);
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  return response.json();
}

