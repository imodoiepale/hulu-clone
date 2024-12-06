import { auth } from "@clerk/nextjs/server";
import MovieList from '@/components/MovieList'
import { Genre, requests } from '@/utils/api'
import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#001524]">
      <Header />
      <div className="pt-32 pb-20">
        {(Object.keys(requests) as Genre[]).map((genre) => (
          <MovieList key={genre} genre={genre} title={requests[genre].title} />
        ))}
      </div>
      <MobileNav />
    </main>
  )
}

