// components/MovieForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { MovieService } from '@/services/MovieService'
import { Movie } from '@/types/movie'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'

interface MovieFormProps {
    movieId?: string
}

export default function MovieForm({ movieId }: MovieFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        overview: '',
        poster_path: '',
        vote_average: 0,
        release_date: '',
        studio: ''
    })

    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (movieId) {
            loadMovie()
        }
    }, [movieId])

    const loadMovie = async () => {
        try {
            const movie = await MovieService.getMovie(movieId!)
            if (movie) {
                setFormData(movie)
            }
        } catch (error) {
            toast.error('Failed to load movie')
            console.error(error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)

        try {
            if (movieId) {
                await MovieService.updateMovie(movieId, {
                    ...formData,
                    userId: user.uid
                })
                toast.success('Movie updated successfully')
            } else {
                await MovieService.createMovie({
                    ...formData,
                    userId: user.uid
                })
                toast.success('Movie created successfully')
            }
            router.push('/movies')
        } catch (error) {
            toast.error(movieId ? 'Failed to update movie' : 'Failed to create movie')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">
                {movieId ? 'Edit Movie' : 'Add New Movie'}
            </h1>

            <div className="space-y-4">
                <Input
                    label="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                <Textarea
                    label="Overview"
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    required
                />

                <Input
                    label="Poster URL"
                    value={formData.poster_path}
                    onChange={(e) => setFormData({ ...formData, poster_path: e.target.value })}
                    required
                />

                <Input
                    label="Rating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.vote_average}
                    onChange={(e) => setFormData({ ...formData, vote_average: parseFloat(e.target.value) })}
                    required
                />

                <Input
                    label="Release Date"
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    required
                />

                <Input
                    label="Studio"
                    value={formData.studio || ''}
                    onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                />
            </div>

            <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (movieId ? 'Update Movie' : 'Add Movie')}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}