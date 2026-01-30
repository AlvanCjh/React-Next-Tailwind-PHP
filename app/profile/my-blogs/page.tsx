"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link'; 

import Navbar from '@/components/navbar';


export default function MyBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [editingBlog, setEditingBlog] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '';

    useEffect(() => { 
        if (email) fetchMyBlogs(); 
    }, [email]);

    const fetchMyBlogs = async () => {
        try {
            const res = await fetch(`http://localhost/api/user/get_my_blogs.php?email=${email}`);
            const result = await res.json();
            if (result.status === 'success') setBlogs(result.data);
        } catch (e) {
            console.error("Connection to paddock lost.", e);
        }
    };

    const handleUpdate = async () => {
        if (!editingBlog.title || !editingBlog.content) return;
        setIsSaving(true);
        
        try {
            const res = await fetch('http://localhost/api/user/update_blog.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingBlog.id,
                    title: editingBlog.title,
                    content: editingBlog.content,
                    email: email 
                }),
            });
            const result = await res.json();
            
            if (result.status === 'success') {
                alert("✅ Post updated and re-verified.");
                setEditingBlog(null);
                fetchMyBlogs();
            } else {
                alert(`⚠️ BLOCKED: ${result.message}`);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen pt-32 bg-[#050505] text-white px-6 font-sans">
            <Navbar />
            <div className="max-w-4xl mx-auto pb-20">
                
                <div className="mb-8">
                    <Link 
                        href="/profile" 
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-blue-500 transition-all duration-300"
                    >
                        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                        Return to Profile
                    </Link>
                </div>

                <header className="mb-12 border-l-4 border-blue-600 pl-6">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                        My <span className="text-blue-600">Blogs</span>
                    </h1>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                        Personal Content History
                    </p>
                </header>

                <div className="grid gap-4">
                    {blogs.length > 0 ? blogs.map((blog: any) => (
                        <motion.div 
                            layout
                            key={blog.id} 
                            className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex justify-between items-center group hover:border-blue-600/30 transition-all duration-500"
                        >
                            <div>
                                <h3 className="font-black text-xl italic uppercase tracking-tighter mb-2 group-hover:text-blue-500 transition-colors">
                                    {blog.title}
                                </h3>
                                <div className="flex gap-4 items-center">
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">
                                        Posted: {new Date(blog.created_at).toLocaleDateString()}
                                    </p>
                                    {blog.updated_at !== blog.created_at && (
                                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 rounded-md border border-blue-500/20">
                                            <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                            <span className="text-[8px] text-blue-500 font-black uppercase tracking-widest">Edited</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={() => setEditingBlog(blog)}
                                className="px-8 py-3 bg-blue-600 text-black text-[10px] font-black uppercase rounded-xl hover:bg-white transition-all tracking-widest shadow-lg shadow-blue-500/10"
                            >
                                Edit Post
                            </button>
                        </motion.div>
                    )) : (
                        <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/10">
                            <p className="text-gray-600 italic font-medium uppercase tracking-[0.2em] text-xs">No entries found in your log.</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {editingBlog && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
                        >
                            <header className="mb-10 border-l-4 border-blue-600 pl-6">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                                    Edit <span className="text-blue-600">Entry</span>
                                </h2>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mt-1">Re-verification required on save</p>
                            </header>
                            
                            <div className="space-y-8">
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3 block">Headline</label>
                                    <input 
                                        value={editingBlog.title}
                                        onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-blue-600 transition-all font-bold italic text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3 block">Content Body</label>
                                    <textarea 
                                        rows={8}
                                        value={editingBlog.content}
                                        onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm leading-relaxed text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="mt-12 flex gap-4">
                                <button 
                                    onClick={handleUpdate}
                                    disabled={isSaving}
                                    className="flex-1 py-5 bg-blue-600 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-white transition-all disabled:opacity-50"
                                >
                                    {isSaving ? "AI SCANNING..." : "Update Post"}
                                </button>
                                <button 
                                    onClick={() => setEditingBlog(null)}
                                    className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-red-600 hover:border-red-600 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}