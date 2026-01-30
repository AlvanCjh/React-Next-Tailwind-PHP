"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminBlogManager() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [flagReports, setFlagReports] = useState<{ [key: number]: any }>({});
    const [loadingId, setLoadingId] = useState<number | null>(null);

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        const res = await fetch('http://localhost/api/user/get_blogs.php');
        const result = await res.json();
        setBlogs(result.data);
    };

    const scanWithAI = async (id: number, text: string) => {
        setLoadingId(id);
        try {
            const res = await fetch('http://localhost/api/admin/check_content.php', {
                method: 'POST',
                body: JSON.stringify({ text, blog_id: id }),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("Server Error Output:", errText);
                throw new Error("Server returned 500");
            }

            const result = await res.json();
            setFlagReports(prev => ({ ...prev, [id]: result }));

            if (result.flagged === false) {
                fetchBlogs(); 
            }
        } catch (e) { 
            console.error("AI connection failed.", e);
        } finally { 
            setLoadingId(null); 
        }
    };

    const handleInstantStrike = async (authorId: number, authorName: string) => {
        if (!authorId) return alert("Error: Author ID missing");
        if (!confirm(`Issue an instant strike to author ${authorName}?`)) return;
        try {
            const res = await fetch('http://localhost/api/admin/issue_strike.php', {
                method: 'POST',
                body: JSON.stringify({ id: authorId }),
            });
            const result = await res.json();
            if (result.status === 'success') alert(`✅ Instant strike issued to ${authorName}.`);
        } catch (error) { console.error("Strike error:", error); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Permanently delete this post?")) return;
        const res = await fetch('http://localhost/api/admin/delete_blog.php', {
            method: 'POST',
            body: JSON.stringify({ id }),
        });
        const result = await res.json();
        if (result.status === 'success') {
            setBlogs(prev => prev.filter((b: any) => b.id !== id));
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-sans">
            <AdminNavbar />

            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-end mb-16 border-l-4 border-emerald-500 pl-6">
                    <div>
                        <h1 className="text-5xl font-black italic tracking-tighter uppercase">Race <span className="text-emerald-500">Control</span></h1>
                        <p className="text-gray-400 text-[10px] mt-2 font-black uppercase tracking-[0.3em]">Blog Moderation Terminal</p>
                    </div>
                    <input
                        placeholder="Search title or author..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl w-80 text-sm outline-none focus:border-emerald-500 transition-all font-bold placeholder:text-gray-600"
                    />
                </header>

                <div className="grid gap-8">
                    {blogs.filter((b: any) => 
                        b.title.toLowerCase().includes(search.toLowerCase()) || 
                        b.author_name.toLowerCase().includes(search.toLowerCase())
                    ).map((blog: any) => {
                        const lastScanTime = blog.last_scan_at ? new Date(blog.last_scan_at).getTime() : 0;
                        const updatedTime = new Date(blog.updated_at).getTime();
                        const needsSecurityCheck = lastScanTime === 0 || updatedTime > lastScanTime + 2000;
                        const isScanning = loadingId === blog.id;

                        return (
                            <motion.div
                                layout
                                key={blog.id}
                                className={`p-8 bg-white/5 border rounded-[2.5rem] transition-all relative overflow-hidden ${
                                    flagReports[blog.id]?.flagged ? 'border-red-500/40 bg-red-500/[0.02]' : 
                                    flagReports[blog.id] ? 'border-emerald-500/30 bg-emerald-500/[0.01]' : 'border-white/5'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="font-black text-2xl tracking-tighter uppercase mb-1">{blog.title}</h3>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Author: {blog.author_name}</p>
                                            {needsSecurityCheck && (
                                                <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg shadow-lg shadow-yellow-500/5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                                    <span className="text-[9px] text-yellow-500 font-black uppercase tracking-widest">
                                                        {lastScanTime === 0 ? "New Content" : "Modified"}
                                                    </span>
                                                </span>
                                            )}
                                        </div> 
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => scanWithAI(blog.id, `${blog.title} ${blog.content}`)}
                                            disabled={isScanning}
                                            className={`relative w-40 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all overflow-hidden border ${
                                                isScanning ? 'bg-white/5 border-white/20' : 
                                                needsSecurityCheck ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-emerald-500 text-black border-emerald-500 opacity-80'
                                            }`}
                                        >
                                            <span className={`relative z-10 ${isScanning ? 'text-white' : ''}`}>
                                                {isScanning ? "Scanning Data..." : needsSecurityCheck ? "Security Scan" : "AI Scan"}
                                            </span>
                                            
                                            {/* SCANNING ANIMATION OVERLAY */}
                                            {isScanning && (
                                                <motion.div 
                                                    initial={{ x: "-100%" }}
                                                    animate={{ x: "100%" }}
                                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                                                />
                                            )}
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(blog.id)}
                                            className="w-32 h-11 bg-white/5 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {/* ... Rest of your AnimatePresence content ... */}
                                <AnimatePresence>
                                    {flagReports[blog.id] && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-8 pt-8 border-t border-white/10"
                                        >
                                            {flagReports[blog.id].flagged ? (
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                                        <p className="text-[9px] text-red-500 uppercase font-black mb-2 tracking-widest">Violation</p>
                                                        <p className="text-white font-bold text-xs uppercase">{flagReports[blog.id].category}</p>
                                                    </div>
                                                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                                        <p className="text-[9px] text-gray-500 uppercase font-black mb-2 tracking-widest">Target</p>
                                                        <p className="text-white font-bold text-xs leading-tight">{flagReports[blog.id].targets}</p>
                                                    </div>
                                                    <div className="md:col-span-2 bg-white/5 p-5 rounded-2xl border border-white/5 overflow-hidden">
                                                        <p className="text-[9px] text-gray-500 uppercase font-black mb-2 tracking-widest">Evidence</p>
                                                        <p className="text-gray-400 italic text-[11px] leading-relaxed line-clamp-2">"{flagReports[blog.id].evidence}"</p>
                                                    </div>

                                                    <div className="md:col-span-4 flex items-center justify-between bg-red-500/5 p-5 rounded-2xl border border-red-500/10">
                                                        <div className="flex-1 pr-6">
                                                            <p className="text-[9px] text-red-500 uppercase font-black mb-1 tracking-widest">AI Reasoning</p>
                                                            <p className="text-gray-300 text-[11px] leading-relaxed italic line-clamp-2">{flagReports[blog.id].reason}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleInstantStrike(blog.author_id, blog.author_name)}
                                                            className="px-6 py-2 bg-red-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-red-500 transition-all tracking-widest shrink-0">
                                                                ⚠️ Instant Strike    
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10 flex items-center gap-4">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px]">✓</div>
                                                    <div>
                                                        <p className="text-[9px] text-emerald-500 uppercase font-black mb-1 tracking-widest">AI Safety Analysis</p>
                                                        <p className="text-gray-300 text-xs italic">"{flagReports[blog.id].reason}"</p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}