"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const res = await fetch('http://localhost/api/user/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.status === 'success') {
                localStorage.setItem('userEmail', email); // Save user email to browser memory
                localStorage.setItem('userName', data.name);
                localStorage.setItem('userRole', data.role); // Save user role to browser memory
                localStorage.setItem('userPfp', data.profile_pic || "");
                setMessage('Login successful! Redirecting...');

                window.dispatchEvent(new Event("loginUpdate"));
        
                setTimeout(() => {
                    if (data.role ==='admin') {
                        router.push('/admin/dashboard');
                    } else {
                        router.push('/');
                    }
                }, 1500);
            } else {
                setMessage(data.message);
            } 
        } catch (error) {
                setMessage('An error occurred. Cant connect to PHP.');
            }
        };

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 rounded-2xl bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input type="email" required onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Password</label>
                            <input type="password" required onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 focus:border-blue-500 outline-none transition-all" />
                        </div>
                     
                        {message && (
                            <p className={`text-sm text-center ${message.includes('Success') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>
                        )}

                        <button type="submit" className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-500 transition-all">
                            Sign In
                        </button>
                    </form>
                </motion.div>
        </main>
    )
} 