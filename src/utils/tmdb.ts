interface MovieSearchResponse {
  results: {
    id: number
    title: string
    poster_path: string
    release_date: string
  }[]
}

export async function searchMovies(query: string) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_READ_TOKEN}`,
          Accept: 'application/json'
        }
      }
    )

    if (!res.ok) {
      throw new Error('Failed to fetch movies')
    }

    const data: MovieSearchResponse = await res.json()
    return data.results
  } catch (error) {
    console.error('Error searching movies:', error)
    throw error
  }
}
