'use client'

import { useState, useEffect } from 'react';
import { auth, db } from '@/utils/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface MovieStats {
  totalMovies: number;
  recentMovies: number;
  averageRating: number;
  recentMoviePosters: Array<{
    id: string;
    posterUrl: string;
    title: string;
  }>;
}

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<MovieStats>({
    totalMovies: 0,
    recentMovies: 0,
    averageRating: 0,
    recentMoviePosters: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      } else {
        // Format email to remove @ and everything after it
        const displayName = user.email ? user.email.split('@')[0] : 'Admin';
        setUserName(displayName);
        fetchStats(user.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchStats = async (userId: string) => {
    try {
      // Get recent movies with full data
      const recentQuery = query(
        collection(db, 'movies'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      const recentSnapshot = await getDocs(recentQuery);
      const recentMovies = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        posterUrl: doc.data().posterUrl,
        title: doc.data().title
      }));

      // Get all movies for stats
      const allMoviesSnapshot = await getDocs(collection(db, 'movies'));
      let totalRating = 0;
      allMoviesSnapshot.docs.forEach(doc => {
        totalRating += doc.data().rating || 0;
      });

      setStats({
        totalMovies: allMoviesSnapshot.size,
        recentMovies: recentSnapshot.size,
        averageRating: allMoviesSnapshot.size > 0 ? Number((totalRating / allMoviesSnapshot.size).toFixed(1)) : 0,
        recentMoviePosters: recentMovies
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0F] text-white">
      {/* Header */}
      <nav className="bg-[#1A1C22] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#1CE783]">MovieDB</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {userName}</span>
              <button
                onClick={() => auth.signOut()}
                className="bg-[#1CE783] text-black px-4 py-2 rounded hover:bg-[#15b066] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A1C22] p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Total Movies</h3>
            <p className="text-3xl font-bold text-[#1CE783]">{stats.totalMovies}</p>
          </div>

          <div className="bg-[#1A1C22] p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Average Rating</h3>
            <p className="text-3xl font-bold text-[#1CE783]">{stats.averageRating}/10</p>
          </div>

          <div className="bg-[#1A1C22] p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Recent Additions</h3>
            <p className="text-3xl font-bold text-[#1CE783]">{stats.recentMovies}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Link
            href="/movies/add"
            className="bg-[#1A1C22] p-6 rounded-lg border border-gray-800 hover:bg-[#252830] transition-colors"
          >
            <h3 className="text-lg font-medium text-[#1CE783] mb-2">Add New Movie</h3>
            <p className="text-gray-400">Search and add movies to your collection</p>
          </Link>

          <Link
            href="/movies"
            className="bg-[#1A1C22] p-6 rounded-lg border border-gray-800 hover:bg-[#252830] transition-colors"
          >
            <h3 className="text-lg font-medium text-[#1CE783] mb-2">View Collection</h3>
            <p className="text-gray-400">Browse and manage your movie collection</p>
          </Link>
        </div>

        {/* Recent Movies */}
        <div className="bg-[#1A1C22] rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold mb-6">Recent Additions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.recentMoviePosters.map((movie) => (
              <div key={movie.id} className="relative group">
                <div className="aspect-[2/3] rounded-lg overflow-hidden">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <p className="text-sm text-white truncate">{movie.title}</p>
                </div>
              </div>
            ))}
            {stats.recentMoviePosters.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No movies added yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}