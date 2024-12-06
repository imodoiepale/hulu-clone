import Image from 'next/image'
import { Heart } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface MovieCardProps {
  movie: {
    id: number
    title: string
    poster_path: string
    vote_average: number
    overview: string
    release_date: string
  }
  isFavorite: boolean
  onFavoriteToggle: () => void
}

export default function MovieCard({ movie, isFavorite, onFavoriteToggle }: MovieCardProps) {
  return (
    <div className="relative group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <button
          onClick={onFavoriteToggle}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50"
        >
          <Heart 
            className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`}
          />
        </button>
      </div>
      <div className="mt-2">
        <h3 className="font-semibold text-white truncate">{movie.title}</h3>
        <p className="text-sm text-[#666666] line-clamp-2 mt-1">{movie.overview}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-[#666666]">
          <span>{formatDistanceToNow(new Date(movie.release_date))} ago</span>
          <span>•</span>
          <span>{movie.vote_average.toFixed(1)} Rating</span>
        </div>
      </div>
    </div>
  )
}

