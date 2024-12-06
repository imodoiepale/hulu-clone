// @ts-nocheck
'use client'

import { useState, useEffect } from 'react';
import { db, auth } from '@/utils/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Movie {
    id: string;
    title: string;
    studio: string;
    rating: number;
    posterUrl: string;
    userId?: string;
}

export default function MovieList() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'movies'));
            const moviesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Movie[];
            setMovies(moviesList);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setError('Failed to load movies');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!auth.currentUser) {
            setError('You must be logged in to delete movies');
            return;
        }

        if (confirm('Are you sure you want to delete this movie?')) {
            try {
                const movieRef = doc(db, 'movies', id);
                await deleteDoc(movieRef);
                setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
                setError(null);
            } catch (error) {
                console.error('Error deleting movie:', error);
                setError('Failed to delete movie. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#1CE783] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0C0F] text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sticky top-2">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">My Collection</h1>
                    <Link href="/movies/add">
                        <Button className="bg-[#1CE783] hover:bg-[#15B76C] text-black font-medium">
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Movie
                        </Button>
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 md:gap-6">
                    {movies.map((movie) => (
                        <Card key={movie.id} className="bg-[#1A1C22] border-none overflow-hidden group">
                            <div className="relative aspect-[2/3] text-white">
                                <Image
                                    src={movie.posterUrl || '/api/placeholder/400/600'}
                                    alt={movie.title}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    sizes="(max-width: 640px) 50vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex gap-2">
                                        <Link href={`/movies/edit/${movie.id}`}>
                                            <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white/20">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(movie.id)}
                                            className="bg-transparent border-red-500 text-red-500 hover:bg-red-500/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 md:p-4 space-y-1 md:space-y-2">
                                <h2 className="font-semibold text-sm md:text-lg line-clamp-1 text-white">{movie.title}</h2>
                                <div className="flex items-center text-xs md:text-sm text-white">
                                    Rating: {movie.rating}/10
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {movies.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-white mb-4">Your collection is empty</div>
                        <Link href="/movies/add">
                            <Button className="bg-[#1CE783] hover:bg-[#15B76C] text-black font-medium">
                                <Plus className="w-5 h-5 mr-2" />
                                Add Your First Movie
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}