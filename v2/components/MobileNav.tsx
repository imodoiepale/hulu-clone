'use client'

import { Home, Zap, Clock, FolderOpen, Search, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#001a2c] border-t border-[#333333] md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === '/' ? 'text-white' : 'text-[#666666]'
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link 
          href="/trending" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === '/trending' ? 'text-white' : 'text-[#666666]'
          }`}
        >
          <Zap size={24} />
          <span className="text-xs mt-1">Trending</span>
        </Link>
        <Link 
          href="/watchlist" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === '/watchlist' ? 'text-white' : 'text-[#666666]'
          }`}
        >
          <Clock size={24} />
          <span className="text-xs mt-1">Watchlist</span>
        </Link>
        <Link 
          href="/browse" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === '/browse' ? 'text-white' : 'text-[#666666]'
          }`}
        >
          <FolderOpen size={24} />
          <span className="text-xs mt-1">Browse</span>
        </Link>
        <Link 
          href="/search" 
          className={`flex flex-col items-center justify-center w-full h-full ${
            pathname === '/search' ? 'text-white' : 'text-[#666666]'
          }`}
        >
          <Search size={24} />
          <span className="text-xs mt-1">Search</span>
        </Link>
        
      </div>
    </nav>
  )
}

