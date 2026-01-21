

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaLaughSquint, FaUserSecret, FaMask } from 'react-icons/fa';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';

const TrollFun = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('https://ebaub-backend.vercel.app/api/posts')
      .then(res => res.json())
      .then(data => {
        // Filter strictly for 'Troll & Fun' category
        const filtered = data.filter(p => p.category === 'Troll & Fun');
        setPosts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-orange-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50 pb-20 relative">
      
      {/* --- 🔥 Modern Hero Banner --- */}
      <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white py-16 md:py-20 text-center rounded-b-[3rem] shadow-2xl mb-12 overflow-hidden">
        
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-10 w-40 h-40 bg-yellow-200 rounded-full mix-blend-overlay blur-2xl"></div>
          <FaLaughSquint className="absolute bottom-5 left-10 text-9xl text-white opacity-10 -rotate-12" />
        </div>

        <motion.div 
          initial={{ y: -30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-4"
        >
          {/* Secret Badge */}
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4 border border-white/30 shadow-sm">
            <FaUserSecret className="text-lg" /> 
            এখানে আপনার নাম ১০০% গোপন থাকবে!
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight flex justify-center items-center gap-3">
            Troll & Fun <FaLaughSquint className="text-white animate-bounce" />
          </h1>
          
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed font-light">
            হাসি আর বিনোদনের সেরা জায়গা! নাম প্রকাশ না করেই শেয়ার করুন মজার সব ঘটনা।
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
          <div className="text-center text-gray-500 py-16 bg-white rounded-2xl shadow-sm border border-dashed border-orange-200">
            <FaMask className="text-6xl mx-auto text-orange-200 mb-4" />
            <p className="text-xl font-medium text-orange-600">এখনো কোনো পোস্ট নেই! 😂</p>
            <p className="text-sm text-gray-400 mt-2">আপনিই প্রথম মজার কিছু শেয়ার করুন।</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link to="/create-post" className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-600 to-amber-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition duration-300 z-50 group border-4 border-white/30">
        <FaPlus className="text-2xl group-hover:rotate-90 transition duration-300" />
      </Link>
    </div>
  );
};

export default TrollFun;