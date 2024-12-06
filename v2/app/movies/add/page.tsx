// @ts-nocheck

'use client'
import { useState } from 'react';
import { db, auth } from '@/utils/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MovieResult {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview: string;
}

export default function AddMovie() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<MovieResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<MovieResult | null>(null);
    const router = useRouter();

    const searchMovies = async () => {
        if (!searchQuery) return;
        setLoading(true);

        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchQuery}&language=en-US&page=1&include_adult=false`
            );
            const data = await response.json();
            setSearchResults(data.results);
        } catch (error) {
            console.error('Error searching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMovie = async (confirmed = false) => {
        if (!selectedMovie || !confirmed) return;

        try {
            await addDoc(collection(db, 'movies'), {
                title: selectedMovie.title,
                posterUrl: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`,
                rating: selectedMovie.vote_average,
                overview: selectedMovie.overview,
                releaseDate: selectedMovie.release_date,
                tmdbId: selectedMovie.id,
                userId: auth.currentUser?.uid,
                createdAt: new Date().toISOString()
            });

            setSelectedMovie(null);
            router.push('/movies');
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0C0F] text-white">
            {/* Sticky Search Section */}
            <div className="sticky top-0 z-10 bg-[#0B0C0F] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Add to Your Collection</h1>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 pointer-events-none" />
                                    <Input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && searchMovies()}
                                        placeholder="Search for movies..."
                                        className="w-full bg-[#1A1C22] border-none text-white placeholder:text-gray-400 h-12 pl-10"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={searchMovies}
                                disabled={loading}
                                className="bg-[#1CE783] hover:bg-[#15B76C] text-black font-medium h-12 px-6"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-2 gap-4">
                    {searchResults.map((movie) => (
                        <Card key={movie.id} className="bg-[#1A1C22] border-none overflow-hidden group relative">
                            <div className="absolute top-2 right-2 z-10">
                                <Button
                                    onClick={() => setSelectedMovie(movie)}
                                    className="bg-[#1CE783] hover:bg-[#15B76C] text-black w-6 h-6 p-0 rounded-full"
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                            <div className="relative aspect-[2/3]">
                                {movie.poster_path ? (
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#2C2F36] flex items-center justify-center">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="p-4 space-y-2">
                                <h3 className="font-semibold text-lg line-clamp-1 text-white">
                                    {movie.title}
                                </h3>
                                <div className="flex items-center text-sm text-white space-x-2">
                                    <span>{new Date(movie.release_date).getFullYear()}</span>
                                    <span>•</span>
                                    <span>{movie.vote_average.toFixed(1)} Rating</span>
                                </div>
                                <p className="text-sm text-white line-clamp-2">{movie.overview}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {searchResults.length === 0 && searchQuery && !loading && (
                    <div className="text-center text-white py-12">
                        No movies found matching "{searchQuery}"
                    </div>
                )}
            </div>

            {/* Add Movie Dialog */}
            <AlertDialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
                <AlertDialogContent className="bg-[#1A1C22] border border-gray-800 text-white max-w-2xl">
                    <div className="grid grid-cols-3 gap-6">
                        {/* Movie Poster */}
                        <div className="col-span-1">
                            {selectedMovie?.poster_path ? (
                                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                                        alt={selectedMovie.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-[2/3] bg-[#2C2F36] rounded-lg flex items-center justify-center">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Movie Details */}
                        <div className="col-span-2 space-y-4">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl text-white">
                                    {selectedMovie?.title}
                                </AlertDialogTitle>
                            </AlertDialogHeader>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="bg-[#2C2F36] px-2 py-1 rounded">
                                        {selectedMovie?.release_date &&
                                            new Date(selectedMovie.release_date).getFullYear()}
                                    </span>
                                    <span className="bg-[#2C2F36] px-2 py-1 rounded">
                                        Rating: {selectedMovie?.vote_average.toFixed(1)}/10
                                    </span>
                                </div>

                                <AlertDialogDescription className="text-gray-300 !mt-4">
                                    {selectedMovie?.overview}
                                </AlertDialogDescription>

                                <div className="border-t border-gray-800 pt-4">
                                    <h4 className="text-sm font-medium text-white mb-2">Additional Details</h4>
                                    <dl className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <dt className="text-gray-400">Release Date</dt>
                                            <dd className="text-white">
                                                {selectedMovie?.release_date &&
                                                    new Date(selectedMovie.release_date).toLocaleDateString()}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-400">TMDB ID</dt>
                                            <dd className="text-white">{selectedMovie?.id}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <AlertDialogFooter className="!mt-6">
                                <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleAddMovie(true)}
                                    className="bg-[#1CE783] hover:bg-[#15B76C] text-black"
                                >
                                    Add to Collection
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}