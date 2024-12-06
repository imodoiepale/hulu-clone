'use client'

import { useState, useEffect } from 'react'
import { fetchMovies, Genre } from '@/utils/api'
import MovieCard from './MovieCard'
import { db } from '@/utils/firebase'
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore'
import { useAuth } from '@clerk/nextjs'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface MovieListProps {
  genre: Genre
  title: string
}

export default function MovieList({ genre, title }: MovieListProps) {
  const [movies, setMovies] = useState<any[]>([])
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const { userId } = useAuth()

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await fetchMovies(genre)
        setMovies(data.results)
      } catch (error) {
        console.error('Error fetching movies:', error)
      }
    }
    loadMovies()
  }, [genre])

  useEffect(() => {
    async function loadFavorites() {
      if (!userId) return
      const favoritesRef = collection(db, 'favorites')
      const q = query(favoritesRef, where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      const favoriteIds = new Set(querySnapshot.docs.map(doc => doc.data().movieId))
      setFavorites(favoriteIds)
    }
    loadFavorites()
  }, [userId])

  const toggleFavorite = async (movieId: number) => {
    if (!userId) return
    const favoritesRef = collection(db, 'favorites')
    if (favorites.has(movieId)) {
      const q = query(favoritesRef, where('userId', '==', userId), where('movieId', '==', movieId))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref)
      })
      favorites.delete(movieId)
    } else {
      await addDoc(favoritesRef, { userId, movieId })
      favorites.add(movieId)
    }
    setFavorites(new Set(favorites))
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 px-4">{title}</h2>
      <ScrollArea className="w-full">
        <div className="flex gap-4 px-4">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-[250px]">
              <MovieCard 
                movie={movie} 
                isFavorite={favorites.has(movie.id)}
                onFavoriteToggle={() => toggleFavorite(movie.id)}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}

