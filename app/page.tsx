"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

// Define carousel data
const slides = [
  {
    id: 1,
    title: "Formula 1 Excellence",
    description: "Discover how Mercedes AMG Petronas F1 leverages cutting-edge technology to dominate the racetrack.",
    color: "bg-blue-600/20",
    image: "/1.jpg"
  },
  {
    id: 2,
    title: "Driver Mastery",
    description: "Explore the skills and strategies that make Lewis Hamilton and George Russell champions in the world of Formula 1.",
    color: "bg-purple-600/20",
    image: "/2.jpg"
  },
  {
    id: 3,
    title: "Racecraft Innovation",
    description: "Unveil the innovative engineering and teamwork behind Mercedes AMG Petronas F1's success on and off the track.",
    color: "bg-emerald-600/20",
    image: "/3.jpg"
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <main className="relative flex min-h-screen flex-col items-center justify-center text-center px-4 overflow-hidden">
        
        {/* Image Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/1.gif"
            alt="Hero Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_25px_rgba(37,99,235,0.5)]"
        >
          Mercedes AMG Petronas F1 
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10 mt-6 text-xl text-gray-200 max-w-lg"
        >
          Experience cutting-edge performance and innovation with the champions of Formula 1 racing.
        </motion.p>

        <motion.button
          onClick={scrollToContent}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 mt-10 px-8 py-3 bg-blue-600 rounded-full font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
        >
          Get Started
        </motion.button>
      </main>

      {/* Features Section */}
      <section ref={contentRef} className="relative min-h-screen py-20 px-10 overflow-hidden">

        {/* Image Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/4.jpg"
            alt="Features Background"
            fill
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-white"
          >
            Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: 1, title: "Cutting-Edge Technology", desc: "Harness the power of advanced engineering and innovation that drives our Formula 1 success."},
              { num: 2, title: "Unmatched Performance", desc: "Experience unparalleled speed and precision on the racetrack with our state-of-the-art vehicles."},
              { num: 3, title: "Global Excellence", desc: "Join a legacy of champions and be part of a team that defines excellence in motorsport."},
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-blue-500/50 transition-all hover:bg-black/60 shadow-2xl"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center text-xl font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                  {f.num}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Interactive Information Carousel */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: Visual Display */}
          <div className="relative h-[350px] md:h-[450px] w-full perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative`}
              >
                {/* Custom Image Component */}
                <Image
                  src={slides[activeTab].image} 
                  alt={slides[activeTab].title}
                  fill 
                  className="object-cover" 
                  priority
                />
                <div className={`absolute inset-0 ${slides[activeTab].color} mix-blend-overlay`} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Content Display */}
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[200px]"
              >
                <span className="text-blue-500 font-mono text-sm uppercase tracking-widest">Case Study 0{slides[activeTab].id}</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-white">{slides[activeTab].title}</h2>
                <p className="text-lg text-gray-400 leading-relaxed">{slides[activeTab].description}</p>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            <div className="flex gap-3 mt-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`h-1.5 transition-all duration-500 rounded-full ${
                    activeTab === index ? "w-16 bg-blue-600" : "w-6 bg-gray-800 hover:bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Section */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto overflow-hidden rounded-3xl relative p-12 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient opacity-90" />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Join Us Today!</h2>
            
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut"}}
              className="flex justify-center mb-10"
            >
              <div className="w-64 h-40 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="p-4 text-left">
                  <div className="w-10 h-2 bg-blue-400 rounded-full mb-2 opacity-50"></div>
                  <div className="w-20 h-2 bg-white rounded-full mb-4 opacity-30"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-white/5 rounded-md"></div>
                    <div className="h-10 bg-white/5 rounded-md"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Become part of our community and leverage the power of cutting-edge technology to elevate your projects to new heights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-xl">Get Started</button>
              <button className="px-8 py-4 bg-black/30 text-white font-bold rounded-xl border border-white/20 hover:bg-black/50 transition-colors">Learn More</button>
            </div>
          </div>
        </motion.div> 
      </section>
    </>
  );
}

