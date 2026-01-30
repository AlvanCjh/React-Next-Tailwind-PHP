"use client"

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CreateBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userEmail = localStorage.getItem('userEmail');

        if (!userEmail) {
            setMessage("You must be logged in to post.");
            return;
        }

        const formData = new FormData();
        formData.append('email', userEmail);
        formData.append('title', title);
        formData.append('content', content);
        if (image) formData.append('image', image);

        try {
            const res = await fetch('http://localhost/api/user/upload_blog.php', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.status === 'success') {
                setMessage("Post successful! Redirecting...");
                setTimeout(() => router.push('/blog'), 1500);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Error connecting to server.");
        }
    };

    return (
        <main className="min-h-screen pt-32 px-6 flex justify-center bg-black">
            <motion.div
                initial = {{ opacity: 0 }}
                animate = {{ opacity: 1 }}
                className="w-full max-w-2xl bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                    <h1 className="text-3xl font-bold mb-6 text-white">Create F1 Story</h1>
                    <form onSubmit= { handleSubmit } className="space-y-6">
                        <input
                            type="text" placeholder="Title of your blog" required
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white focus:border-blue-500 outline-none"
                        />
                        <textarea
                            placeholder="Write your story about Mercedes AMG Petronas..." required
                            rows={ 6 } onChange={(e) => setContent(e.target.value)}
                            className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white focus:border-blue-500 outline-none resize-none"
                        />

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500/50 transition-all"
                        >
                            {image ? <span className="text-blue-400">{image.name}</span> : <span className="text-gray-500">Click to upload image</span>}
                            <input type="file" ref={fileInputRef} hidden onChange={(e) => setImage(e.target.files?.[0] || null)} accept="image/*" />
                        </div>

                        <button type="submit" className="w-full py-4 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                            Post to Community
                        </button>
                        {message && <p className="text-center text-sm text-blue-400">{message}</p>}
                    </form>
                </motion.div>
        </main>
    )
}