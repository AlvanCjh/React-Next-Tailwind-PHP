"use client"

import { motion } from 'framer-motion';
import Link from 'next/link';

import AdminNavbar from '@/components/AdminNavbar';

export default function AdminDashboard() {
    return (
        <main className="min-h-screen bg-[#050505] text-white pt-24 px-10">
            <AdminNavbar />

            <motion.div
                initial={{ opacity: 0, y: 20}}
                animate={{ opacity: 1, y: 0}}
                className="max-w-7xl mx-auto"
            >
                <header className="mb-10">
                    <h1 className="text-4xl font-black italic tracking-tighter">
                        ADMIN <span className="text-emerald-500">CONTROL</span>
                    </h1>
                </header>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Large Hero Tile: Blog Moderation */}
                    <Link href="/admin/blogs" className="col-span-12 md:col-span-8">
                        <div className="h-full p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/[0.08] transition-all group relative overflow-hidden">
                            <h2 className="text-3xl font-black mb-3 group-hover:text-emerald-400">MODERATE BLOGS</h2>
                            <p className="text-gray-400 text-sm max-w-md">Gemini-powered safety analysis for all paddock stories.</p>
                            <div className="mt-6 flex gap-2">
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase">AI-READY</span>
                                <span className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-bold rounded-full border border-white/10 uppercase">ZERO TOLERANCE</span>
                            </div>
                        </div>
                    </Link>

                    {/* Medium Tile: User Directory */}
                    <Link href="/admin/users" className="col-span-12 md:col-span-4">
                        <div className="h-full p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/[0.08] transition-all group">
                            <h2 className="text-xl font-bold mb-2 group-hover:text-emerald-400 text-emerald-500">USER DIRECTORY</h2>
                            <p className="text-gray-400 text-xs leading-relaxed">View all registered paddock members and monitor violations count.</p>
                        </div>
                    </Link>

                    {/* Small Utility Tile: System Alerts */}
                    <div className="col-span-12 md:col-span-4 p-6 bg-white/5 border border-white/10 rounded-[2rem]">
                        <p className="text-[10px] font-black uppercase text-gray-500 mb-2">System Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm font-bold">GEMINI 2.5 FLASH ACTIVE</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}