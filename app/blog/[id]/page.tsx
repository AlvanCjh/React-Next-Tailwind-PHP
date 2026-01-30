"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image';

// Interface of the blog
interface Blog {
    id: number;
    title: string;
    content: string;
    author_name: string;
    author_pfp: string | null;
    image_path: string;
    created_at: string;
}

export default function BlogPost() {
    const { id } = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`http://localhost/api/user/get_blogs.php`);
                const result = await res.json();
                if (result.status === 'success') {
                    const post = result.data.find((b: Blog) => b.id.toString() === id);
                    setBlog(post || null);
                }
            } catch (error) {
                console.error("Error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    // Blog loading
    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
    if (!blog) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Post not found.</div>;

    return (
        <main className="min-h-screen bg-black pt-32 pb-20 px-6">
            <motion.div 
                initial= {{ opacity: 0, y: 20}}
                animate= {{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto">
                    <button onClick={() => router.back()} className="text-blue-500 mb-8 hover:underline text-sm font-bold">
                        ← BACK TO FEED
                    </button>

                    {/* Blog Image */}
                    <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-10 border border-white/10">
                        {blog.image_path ? (
                            <Image 
                                src={`http://localhost/api/user/uploads/${blog.image_path}`}
                                alt={blog.title} 
                                fill 
                                unoptimized 
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 font-black text-4xl italic">MERCEDES F1</div>
                        )}
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    {/* Author and Date Section */}
                    <div className="flex  items-center gap-4 mb-10 pb-8 border-b border-white/10">
                    
                    {/* Author Avatar Circle */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-blue-600 bg-gray-800 relative">
                        {blog.author_pfp ? (
                            <Image  
                                src={`http://localhost/api/user/pfp/${blog.author_pfp}`}
                                alt={blog.author_name}
                                fill
                                unoptimized={true}
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-lg font-bold text-white uppercase">
                                {blog.author_name[0]}
                            </div>

                        )}
                    </div>

                    {/* Name and Date Container */}
                    <div className="flex flex-1 items-center justify-between">
                        <div className="flex flex-col">
                             <p className="text-white font-bold text-lg leading-none mb-1">{blog.author_name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 text-xs font-medium uppercase tracking-tighter">
                                Published On
                            </p>
                            <p className="text-gray-300 text-sm font-semibold">
                                {new Date(blog.created_at).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{blog.content}</p>
                    </div>
                </motion.div>
        </main>
    );
}