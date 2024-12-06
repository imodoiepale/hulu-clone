'use client'

import { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface MovieData {
    title: string;
    overview: string;
    rating: string;
    posterUrl: string;
    releaseDate: string;
    tmdbId: number;
}

export default function EditMovieClient({ params }: { params: { id: string } }) {
    const [formData, setFormData] = useState<MovieData>({
        title: '',
        overview: '',
        rating: '',
        posterUrl: '',
        releaseDate: '',
        tmdbId: 0
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchMovie();
    }, []);

    const fetchMovie = async () => {
        try {
            const movieDoc = await getDoc(doc(db, 'movies', params.id));
            if (movieDoc.exists()) {
                const data = movieDoc.data();
                setFormData({
                    title: data.title || '',
                    overview: data.overview || '',
                    rating: data.rating?.toString() || '',
                    posterUrl: data.posterUrl || '',
                    releaseDate: data.releaseDate || '',
                    tmdbId: data.tmdbId || 0
                });
            }
        } catch (error) {
            console.error('Error fetching movie:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateDoc(doc(db, 'movies', params.id), {
                ...formData,
                rating: Number(formData.rating),
                updatedAt: new Date().toISOString()
            });

            router.push('/movies');
        } catch (error) {
            console.error('Error updating movie:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0B0C0F] py-8 text-white">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-[#1A1C22] rounded-lg border border-gray-800 p-6">
                    <h1 className="text-2xl font-bold mb-6 text-[#1CE783]">Edit Movie</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-gray-300">Movie Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-3 bg-[#0B0C0F] border border-gray-700 rounded-lg 
                                         text-white focus:border-[#1CE783] focus:outline-none"
                                required
                            />
                        </div>

                        {/* Poster Preview */}
                        {formData.posterUrl && (
                            <div className="mt-4">
                                <label className="mb-2 block text-gray-300">Poster Preview</label>
                                <div className="relative w-48 h-72 mx-auto">
                                    <img
                                        src={formData.posterUrl}
                                        alt={formData.title}
                                        className="rounded-lg object-cover shadow-lg"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block mb-2 text-gray-300">Overview</label>
                            <textarea
                                value={formData.overview}
                                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                                className="w-full p-3 bg-[#0B0C0F] border border-gray-700 rounded-lg 
                                         text-white focus:border-[#1CE783] focus:outline-none"
                                rows={4}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-300">Rating (0-10)</label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                className="w-full p-3 bg-[#0B0C0F] border border-gray-700 rounded-lg 
                                         text-white focus:border-[#1CE783] focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-300">Release Date</label>
                            <input
                                type="date"
                                value={formData.releaseDate.split('T')[0]}
                                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                                className="w-full p-3 bg-[#0B0C0F] border border-gray-700 rounded-lg 
                                         text-white focus:border-[#1CE783] focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-300">Poster URL</label>
                            <input
                                type="url"
                                value={formData.posterUrl}
                                onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                                className="w-full p-3 bg-[#0B0C0F] border border-gray-700 rounded-lg 
                                         text-white focus:border-[#1CE783] focus:outline-none"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-4 mt-8">
                            <button
                                type="button"
                                onClick={() => router.push('/movies')}
                                className="px-6 py-3 border border-gray-700 rounded-lg text-gray-300 
                                         hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-[#1CE783] text-black rounded-lg 
                                         hover:bg-[#15b066] transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}