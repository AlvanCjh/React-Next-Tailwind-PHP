"use client";

import Link from 'next/link';

export default function AdminNavbar() {
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <nav className="fixed top-0 w-full z-[60] bg-emerald-950/30 backdrop-blur-xl border-b border-emerald-500/20">
            {/* Centered Container */}
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/admin/dashboard" className="font-black text-xl tracking-tighter text-emerald-400 flex items-center gap-2">
                        <span className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse"></span>
                        ADMIN <span className="text-white">CONTROL</span>
                    </Link>
                    
                    <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Link href="/admin/blogs" className="hover:text-emerald-400 transition-colors">Moderate</Link>
                        <Link href="/admin/users" className="hover:text-emerald-400 transition-colors">Users</Link>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/" className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-all">
                        Exit
                    </Link>
                    <button 
                        onClick={handleLogout} 
                        className="px-6 py-2 bg-red-600 text-white rounded-lg text-[10px] font-black hover:bg-red-500 transition-all tracking-widest uppercase shadow-lg shadow-red-600/20"
                    >
                        Shutdown
                    </button>
                </div>
            </div>
        </nav>
    );
}