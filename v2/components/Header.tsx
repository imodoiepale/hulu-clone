import Link from 'next/link'
import { UserButton } from "@clerk/nextjs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const categories = [
  "Trending",
  "Top Rated",
  "Action",
  "Comedy",
  "Horror",
  "Romance",
  "Mystery",
  "Sci-Fi",
  "Western",
  "Animation",
  "TV Movie"
]

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#001524]">
      <div className="flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold text-white">
          MovieDB
        </Link>
        <UserButton afterSignOutUrl="/"/>
      </div>
      <ScrollArea className="w-full border-b border-[#333333]">
        <div className="flex px-4 pb-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="flex-none text-sm text-[#666666] hover:text-white px-3 py-2 first:pl-0"
            >
              {category}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </header>
  )
}

