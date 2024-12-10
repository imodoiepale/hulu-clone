// @ts-nocheck

'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, List, LogOut } from 'lucide-react';
import { auth } from '@/utils/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    // If not authenticated, don't render the navigation
    if (!isAuthenticated) {
        return null;
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navItems = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: List, label: 'Movies', path: '/movies' },
        { icon: PlusCircle, label: 'Add Movie', path: '/movies/add' },
        { icon: LogOut, label: 'Sign Out', onClick: handleSignOut },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1C22] border-t border-gray-800 z-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = pathname === item.path;

                        if (item.onClick) {
                            return (
                                <button
                                    key={item.label}
                                    onClick={item.onClick}
                                    className="flex flex-col items-center py-3 px-4 transition-colors text-gray-400 hover:text-[#1CE783]"
                                >
                                    <IconComponent className="h-6 w-6 mb-1" />
                                    <span className="text-xs">{item.label}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex flex-col items-center py-3 px-4 transition-colors ${isActive ? 'text-[#1CE783]' : 'text-gray-400 hover:text-[#1CE783]'
                                    }`}
                            >
                                <IconComponent className="h-6 w-6 mb-1" />
                                <span className="text-xs">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}