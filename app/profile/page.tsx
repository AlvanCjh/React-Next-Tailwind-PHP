"use client";

import { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  // Profiles
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState<string | null>(null);
  const [strikes, setStrikes] = useState(0);

  // Images
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchProfile(storedEmail);
    }
  }, []);

  const fetchProfile = async (userEmail: string) => {
    const res = await fetch(`http://localhost/api/user/get_profile.php?email=${userEmail}`);
    const result = await res.json();
    if (result.status === 'success') {
      setUsername(result.data.name);
      setStrikes(parseInt(result.data.strikes) || 0);
      
      if (result.data.profile_pic) {
        setPfp(result.data.profile_pic);
        localStorage.setItem('userPfp', result.data.profile_pic);
        window.dispatchEvent(new Event("profileUpdate"));
      }
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result as string));
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_area: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleUpload = async () => {
    const fileInput = document.getElementById('pfpInput') as HTMLInputElement;
    if (!fileInput.files?.[0]) return;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', fileInput.files[0]);

    const res = await fetch('http://localhost/api/user/upload_pfp.php', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.status === 'success') {
      setPfp(data.image_path);
      localStorage.setItem('userPfp', data.image_path);
      window.dispatchEvent(new Event("profileUpdate"));
      setImageSrc(null);
      alert("Profile picture updated!");
    }
  };

  return (
    <main className="min-h-screen pt-32 bg-[#050505] text-white px-6 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Profile Header & Picture */}
        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
          <header className="mb-10 border-l-4 border-blue-600 pl-6">
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                  Profile <span className="text-blue-600">Settings</span>
              </h1>
              <p className="text-gray-500 text-[10px] mt-1 font-black uppercase tracking-[0.3em]">{username || 'Paddock Member'}</p>
          </header>

          <div className="flex flex-col items-center gap-6">
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-blue-600 bg-gray-900 shadow-2xl shadow-blue-500/10">
              {pfp ? (
                <img src={`http://localhost/api/user/pfp/${pfp}`} className="object-cover w-full h-full" alt="Profile" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-3xl text-white/5 uppercase italic">
                  {username ? username[0] : "?"}
                </div>
              )}
            </div>

            <input type="file" id="pfpInput" accept="image/*" onChange={onFileChange} className="hidden" />
            <button 
                onClick={() => document.getElementById('pfpInput')?.click()} 
                className="text-[10px] text-blue-500 font-black uppercase tracking-widest hover:text-white transition-all duration-300 border-b border-transparent hover:border-white"
            >
              Update Profile Picture
            </button>
          </div>
        </div>

        {/* Status Card*/}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group"
        >
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Super License Status</h3>
                    <p className="text-2xl font-black tracking-tighter uppercase">Account <span className="text-blue-600">Points Standing</span></p>
                </div>
                
                <div className="text-right">
                    <p className={`text-5xl font-black tracking-tighter ${
                        strikes >= 2 ? 'text-red-500' : 
                        strikes === 1 ? 'text-yellow-500' : 'text-emerald-500'
                    }`}>
                        {strikes}<span className="text-sm text-gray-600 not-italic ml-1 tracking-normal font-bold">/3</span>
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">Penalty Points</p>
                </div>
            </div>

            {/* Warnings Section */}
            {strikes > 0 ? (
                <div className="mt-8 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl">
                    <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.1em] leading-relaxed">
                        ⚠️ Warning Check: Account has active penalty points from inappropriate blogs creation. <br/> Reaching 3 points results in immediate expulsion.
                    </p>
                </div>
            ) : (
                <div className="mt-8 p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em]">License Status: Grade A</p>
                </div>
            )}
            
            {/* Minimalist background accent */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all duration-700" />
        </motion.div>

        <button
          onClick={() => window.location.href = '/profile/my-blogs'}
          className="w-full p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:bg-blue-600/5 transition-all duration-500"
        >
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Content Terminal</p>
            <p className="text-xl font-black italic tracking-tighter uppercase">Manage My <span className="text-blue-600">Blogs</span></p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500">
              <span className="text-blue-600 group-hover:text-black font-black text-xl">→</span>
            </div>
          </div>
        </button>

        {/* Crop Modal */}
        {imageSrc && (
          <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl p-10 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg h-96 rounded-[2rem] overflow-hidden border border-white/10">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-10 flex gap-4">
              <button 
                onClick={handleUpload} 
                className="px-10 py-4 bg-blue-600 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-white transition-all duration-300"
              >
                Confirm Crop
              </button>
              <button 
                onClick={() => setImageSrc(null)} 
                className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-red-600 hover:border-red-600 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}