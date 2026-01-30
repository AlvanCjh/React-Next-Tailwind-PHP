"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost/api/user/signup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (data.status === 'success') {
                setMessage('Account created! Redirecting to login...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error connecting to PHP server');
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        <input type="text" required onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 focus:border-blue-500 outline-none text-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input type="email" required onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 focus:border-blue-500 outline-none text-white transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input type="password" required onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 focus:border-blue-500 outline-none text-white transition-all" />
                    </div>
                    {message && <p className={`text-sm text-center ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
                    <button type="submit" className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-500 transition-all">Sign Up</button>
                </form>
            </motion.div>
        </main>
    );
}