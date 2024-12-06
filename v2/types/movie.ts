// types/movie.ts
export interface Movie {
    id: string
    title: string
    overview: string
    poster_path: string
    vote_average: number
    release_date: string
    userId: string
    studio?: string
    isFavorite?: boolean
}