"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import AdminNavbar from '@/components/AdminNavbar';

interface User {
    id: number;
    username: string; 
    email: string;
    strikes: number;
    created_at: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('http://localhost/api/admin/get_users.php');
                
                // --- Debug Purposes ---
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const errorText = await res.text();
                    console.error("PHP ERROR DETECTED:", errorText);
                    return;
                }

                const result = await res.json();
                if (result.status === 'success') {
                    setUsers(result.data);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleIssueStrike = async (userId: number) => {
    if (!confirm("Issue a formal strike to this member?")) return;

    try {
        const res = await fetch('http://localhost/api/admin/issue_strike.php', {
            method: 'POST',
            body: JSON.stringify({ id: userId }),
        });
        const result = await res.json();

        if (result.status === 'success') {
            const updatedUsers = users.map((u: any) => 
                u.id === userId ? { ...u, strikes: parseInt(u.strikes) + 1 } : u
            );
            setUsers(updatedUsers);
        }
    } catch (error) {
        console.error("Strike error:", error);
    }
};

    return (
        <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
            <AdminNavbar />
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-end mb-16 border-l-4 border-emerald-500 pl-6">
                    <div>
                        <h1 className="text-5xl font-black italic tracking-tighter uppercase">
                            User <span className="text-emerald-500">Registry</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 font-bold uppercase tracking-widest">
                            Manage Community Members
                        </p>
                    </div>
                    <input 
                        placeholder="Search by username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl w-72 text-sm outline-none focus:border-emerald-500 transition-all placeholder:text-gray-600"
                    />
                </header>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <th className="p-8">Member</th>
                                <th className="p-8">Joined</th>
                                <th className="p-8 text-center">Strikes</th>
                                <th className="p-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.filter((u: any) => u.username.toLowerCase().includes(search.toLowerCase())).map((user: any) => (
                                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-8">
                                            <div className="font-bold text-lg">{user.username}</div>
                                            <div className="text-xs text-gray-500 lowercase">{user.email}</div>
                                        </td>
                                        <td className="p-8 text-sm text-gray-400">
                                            {new Date(user.created_at).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="p-8 text-center">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black border ${
                                                user.strikes >= 3 ? 'bg-red-500/20 text-red-500 border-red-500/30' : 
                                                user.strikes > 0 ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 
                                                'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                                {user.strikes} / 3
                                            </span>
                                        </td>
                                        <td className="p-8 text-right">
                                            <div className="flex gap-3 justify-end transition-opacity">
                                                <button
                                                    onClick={() => handleIssueStrike(user.id)}
                                                    className="px-4 py-2 bg-white/5 text-yellow-500 border border-yellow-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-white transition-all"
                                                >
                                                    Strike
                                                </button>
                                                <button className="px-4 py-2 bg-white/5 text-red-500 border border-red-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                                                    Ban
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center text-gray-600 italic">
                                        No members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}