// app/movies/edit/[id]/page.tsx
import EditMovieClient from './EditMovieClient';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export async function generateStaticParams() {
    if (process.env.NODE_ENV === 'development') {
        return [{ id: 'placeholder' }];
    }

    try {
        const movies = await getDocs(collection(db, 'movies'));
        return movies.docs.map((doc) => ({
            id: doc.id,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [{ id: 'placeholder' }];
    }
}

export default function EditMoviePage({ params }: { params: { id: string } }) {
    return <EditMovieClient params={params} />;
}