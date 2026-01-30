"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Track admin and user 
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const router = useRouter();

  // Check login status on mount
  useEffect(() => {
    const checkUser = () => {
      const storedEmail = localStorage.getItem('userEmail');
      const storedName = localStorage.getItem('userName');
      const storedRole = localStorage.getItem('userRole'); // Capture user role 
      const storedPfp = localStorage.getItem('userPfp');

      setUser(storedEmail);
      setUserName(storedName);
      setRole(storedRole);
      setProfilePic(storedPfp);
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    window.addEventListener('profileUpdate', checkUser);
    window.addEventListener('loginUpdate', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('profileUpdate', checkUser);
      window.removeEventListener('loginUpdate', checkUser);
    };

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setUserName(null);
    setRole(null);
    setProfilePic(null);
    setIsOpen(false);
    window.location.href = '/login';
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    ...(user ? [{ name: 'Feed', href: '/blog' }] : []),
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-10 py-6 bg-black/50 backdrop-blur-md border-b border-white/10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-2xl tracking-tighter">
        MyBrand
      </motion.div>

      <div className="flex gap-8 items-center">
        {navLinks.map((link) => (
          <Link key={link.name} href={link.href} className="text-gray-400 hover:text-blue-500 transition-colors">
            {link.name}
          </Link>
        ))}

        {/* Dynamic Dropdown */}
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
          <button className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
            { /* User Avatar Circle */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-500 bg-gray-800 flex-shrink-0">
              {profilePic ? (
                <Image 
                  src={`http://localhost/api/user/pfp/${profilePic}`}
                  alt="Profile"
                  fill
                  unoptimized={true}
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[12px] font-bold text-white uppercase">
                  {userName ? userName[0] : "?"}
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-white hidden md:block">
              {user ? (role === 'admin' ? "👑 Admin" : "Account") : "Sign In"}
            </span>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              >
                {/* Check if user exists */}
                {user ? (
                  <>
                    { /* Header with large pfp */}
                    <div className="px-4 py-4 flex flex-col items-center border-b border-white/5 bg-white/5">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500 mb-3">
                        {profilePic ? (
                          <img
                            src={`http://localhost/api/user/pfp/${profilePic}`}
                            alt="pfp"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xl font-bold uppercase">
                            {userName ? userName[0] : "?"}
                          </div>
                        )}
                      </div>
                    
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest text-center">
                        {role === 'admin' ? 'ADMIN' : 'USER'}: <span className="text-blue-400">{userName}</span>
                      </div>
                    </div>

                    { /* Admin Login */ }
                    {role === 'admin' && (
                      <Link href="/admin/dashboard" className="block px-4 py-3 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors">
                        Admin Dashboard
                      </Link>
                    )}

                    <Link href="/profile" className="block px-4 py-3 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-colors">
                      Profile Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-3 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-colors">
                      Login
                    </Link>
                    <Link href="/signup" className="block px-4 py-3 text-sm text-gray-300 border-t border-white/5 hover:bg-blue-600 hover:text-white transition-colors">
                      Sign Up
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}