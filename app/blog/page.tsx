"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Blog {
  id: number;
  title: string;
  content: string;
  author_name: string;
  author_pfp: string | null;
  image_path: string;
  created_at: string;
}

export default function BlogFeed() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- Sorting & Filtering States ---
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('http://localhost/api/user/get_blogs.php');
        const result = await res.json();
        if (result.status === 'success') {
          setBlogs(result.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Sorting & Filtering Logic (Matches Admin Design) 
  const filteredAndSortedBlogs = blogs
    .filter((b) => 
        b.title.toLowerCase().includes(search.toLowerCase()) || 
        b.author_name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
    });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Redesigned Header with Admin-Style Sorting */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 border-l-4 border-blue-600 pl-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter text-white">
              COMMUNITY <span className="text-blue-600">FEED</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-widest">
              Mercedes-AMG Petronas Fan Stories
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Search Bar */}
            <input 
              type="text" 
              placeholder="Search title or author..."
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 lg:w-64 p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-600 transition-all"
            />

            {/* Sort Dropdown (Admin Design) */}
            <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-blue-600 transition-all cursor-pointer"
            >
                <option value="newest" className="bg-black">Newest First</option>
                <option value="oldest" className="bg-black">Oldest First</option>
                <option value="title" className="bg-black">A-Z Title</option>
            </select>

            <Link href="/blog/create" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/20 uppercase text-xs tracking-widest">
              Create Post
            </Link>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredAndSortedBlogs.length > 0 ? (
              filteredAndSortedBlogs.map((blog, index) => (
                <motion.div
                  layout
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all flex flex-col"
                >
                  {/* Image Section */}
                  <div className="h-56 relative bg-gray-900 overflow-hidden">
                    {blog.image_path ? (
                      <Image 
                        src={`http://localhost/api/user/uploads/${blog.image_path}`} 
                        alt={blog.title} 
                        fill 
                        unoptimized={true}
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white/5 font-black italic text-3xl">MERCEDES</div>
                    )}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[10px] font-bold text-blue-400 rounded-full border border-blue-500/30 uppercase tracking-tighter">
                            {new Date(blog.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:text-blue-500 transition-colors">
                        {blog.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-8 leading-relaxed flex-1 font-medium">
                      {blog.content}
                    </p>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-600 bg-gray-800 relative flex-shrink-0 shadow-lg shadow-blue-500/10">
                          {blog.author_pfp ? (
                            <Image   
                              src={`http://localhost/api/user/pfp/${blog.author_pfp}`}
                              alt={blog.author_name}
                              fill
                              unoptimized={true}
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs font-black text-white uppercase">
                              {blog.author_name[0]}
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-tighter">
                            {blog.author_name}
                        </span>
                      </div>
                      <Link 
                        href={`/blog/${blog.id}`}
                        className="text-[10px] font-black uppercase text-blue-500 tracking-widest hover:text-white transition-colors"
                      >
                        Read Post →
                      </Link>            
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-32 bg-white/5 border border-dashed border-white/10 rounded-[3rem]"
              >
                <p className="text-gray-500 font-bold italic uppercase tracking-widest">No stories found in the feed</p>
                <button onClick={() => setSearch('')} className="text-blue-500 text-xs font-black mt-4 hover:underline uppercase tracking-widest">Clear Search</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}