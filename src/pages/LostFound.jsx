

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearchLocation, FaBoxOpen } from 'react-icons/fa';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';

const LostFound = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://ebaub-backend.vercel.app/api/posts')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(p => p.category === 'Lost & Found');
        setPosts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-800"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-20 relative">
      
      {/* --- 🔥 Modern Hero Banner --- */}
      <div className="relative bg-gradient-to-br from-gray-800 via-slate-800 to-zinc-900 text-white py-16 md:py-20 text-center rounded-b-[3rem] shadow-2xl mb-12 overflow-hidden">
        
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-overlay blur-2xl"></div>
          <FaSearchLocation className="absolute bottom-5 left-10 text-9xl text-white opacity-10 -rotate-12" />
        </div>

        <motion.div 
          initial={{ y: -30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-4"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm text-xs font-bold mb-4 border border-white/20 text-yellow-400 shadow-sm">
            🔍 হারানো বিজ্ঞপ্তি
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight flex justify-center items-center gap-3">
            Lost & Found <FaSearchLocation className="text-yellow-400 animate-pulse" />
          </h1>
          
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed font-light text-gray-300">
            কিছু হারিয়েছেন বা খুঁজে পেয়েছেন? এখানে পোস্ট করুন। সঠিক প্রমাণ দিয়ে হারানো জিনিস বুঝে নিন।
          </p>
        </motion.div>
      </div>

      {/* --- Post List --- */}
      <div className="max-w-3xl mx-auto px-4">
        {posts.length > 0 ? (
          posts.map(post => (
            <motion.div 
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <PostCard post={post} />
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <FaBoxOpen className="text-6xl mx-auto text-gray-300 mb-4" />
            <p className="text-xl font-medium text-gray-700">এখনো কিছু হারানো যায়নি! 🎉</p>
            <p className="text-sm text-gray-400 mt-2">সবাই সাবধানে আছে, আলহামদুলিল্লাহ।</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link to="/create-post" className="fixed bottom-8 right-8 bg-gradient-to-r from-gray-700 to-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition duration-300 z-50 group border-4 border-white/30">
        <FaPlus className="text-2xl group-hover:rotate-90 transition duration-300" />
      </Link>
    </div>
  );
};

export default LostFound;