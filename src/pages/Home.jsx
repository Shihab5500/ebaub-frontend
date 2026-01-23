

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import { FaPlus, FaFire, FaClock, FaUniversity, FaPenNib } from 'react-icons/fa';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Home = () => {
  const { type } = useParams(); // URL থেকে ক্যাটাগরি ধরা
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 🔥 Rules Popup Logic (Updated Fix) ---
  useEffect(() => {
    const hasSeenRules = sessionStorage.getItem('seenRules');

    if (!hasSeenRules) {
      const timer = setTimeout(() => {
        Swal.fire({
          title: '⚠️ কমিউনিটি রুলস',
          html: `
            <div style="text-align: left; font-size: 16px; line-height: 1.6; color: #333;">
              <p style="margin-bottom: 8px;">✅ ১. কাউকে গালাগালি বা বুলিং করা সম্পূর্ণ নিষেধ।</p>
              <p style="margin-bottom: 8px;">✅ ২. ভার্সিটি বা শিক্ষকদের নিয়ে সম্মানজনক পোস্ট করুন।</p>
              <p style="margin-bottom: 8px;">✅ ৩. কোনো ধরণের গুজব বা ভুয়া খবর ছড়াবেন না।</p>
              <p style="margin-bottom: 0px;">🚫 ৪. নিয়ম অমান্য করলে অ্যাডমিন আপনাকে ব্যান করতে পারে।</p>
            </div>
          `,
          icon: 'warning', // 'info' এর বদলে 'warning' দিলে আইকনটি হলুদ/কমলা সুন্দর দেখাবে
          
          // 🔥 বাটন ফিক্স (Button Fixes)
          showConfirmButton: false, 
          confirmButtonText: 'আমি বুঝতে পেরেছি',
          confirmButtonColor: '#16a34a', // Green Color
          
          showCloseButton: true, // ✅ উপরে ক্লোজ (X) বাটনটি দেখাবে
          allowOutsideClick: true,
          
          // পপআপের সাইজ এবং স্টাইল
          width: '500px',
          padding: '1.5em',
          customClass: {
            confirmButton: 'font-bold px-6 py-2 rounded-lg' // বাটনের টেক্সট বোল্ড করার জন্য
          }
        }).then(() => {
          sessionStorage.setItem('seenRules', 'true');
        });
      }, 3000); // 3 সেকেন্ড পর পপআপ আসবে

      return () => clearTimeout(timer);
    }
  }, []);

  // 1. ডাটাবেস থেকে সব পোস্ট আনা
  useEffect(() => {
    setLoading(true);
    fetch('https://ebaub-backend.vercel.app/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);

        // 2. Trending Logic: লাইক এবং কমেন্ট যোগ করে যারা সেরা, তাদের টপ ৩ বের করা
        const sortedByPopularity = [...data].sort((a, b) => {
          const popularityA = (a.likes?.length || 0) + (a.comments?.length || 0);
          const popularityB = (b.likes?.length || 0) + (b.comments?.length || 0);
          return popularityB - popularityA; // বড় থেকে ছোট
        });
        setTrendingPosts(sortedByPopularity.slice(0, 3)); // সেরা ৩টা পোস্ট
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []); // পেজ লোড হলে একবারই রান হবে

  // 3. Category Filter Logic
  const getCategoryName = (slug) => {
    switch(slug) {
      case 'crush': return 'Crush Confessions';
      case 'troll': return 'Troll & Fun';
      case 'campus-sriti': return 'Campus Sriti';
      case 'lost-found': return 'Lost & Found';
      default: return null; 
    }
  };

  const selectedCategory = getCategoryName(type);

  // যদি ক্যাটাগরি সিলেক্ট থাকে তবে ফিল্টার করো, না থাকলে সব দেখাও
  const displayedPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      
      {/* --- 🔥 UPDATED HERO BANNER (শুধু হোমপেজেই দেখাবে) --- */}
      {!selectedCategory && (
        <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-16 md:py-20 text-center rounded-b-[3rem] shadow-2xl mb-12 overflow-hidden">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-10 w-40 h-40 bg-yellow-300 rounded-full mix-blend-overlay blur-2xl"></div>
            <FaUniversity className="absolute bottom-5 left-10 text-9xl text-white opacity-10 -rotate-12" />
          </div>

          <motion.div 
            initial={{ y: -30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 px-4"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold mb-4 border border-white/30">
              🎓 EBAUB's Own Social Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight">
              EBAUB Fun Hub <span className="animate-bounce inline-block">🎉</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed font-light">
              শেয়ার করো মনের কথা, ক্যাম্পাস স্মৃতি আর আনলিমিটেড মাস্তি! <br/>
              তোমার ক্রাশ বা ট্রল—সব হবে এক ছাদের নিচে।
            </p>

            {/* CTA Button */}
            <div className="mt-8">
              <Link to="/create-post" className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-300 hover:text-green-800 hover:scale-105 transition transform duration-200">
                <FaPenNib /> লেখা শুরু করো
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">

        {/* --- TRENDING SECTION (শুধু হোমপেজেই দেখাবে) --- */}
        {!selectedCategory && trendingPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-l-4 border-orange-500 pl-3">
              <FaFire className="text-orange-500" /> Trending Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {trendingPosts.map((post) => (
                <div key={post._id} className="transform hover:-translate-y-1 transition duration-300">
                   {/* Trending পোস্টগুলো একটু ছোট কার্ডে দেখাবে */}
                   <PostCard post={post} /> 
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- RECENT / CATEGORY POSTS --- */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-l-4 border-primary pl-3">
            {selectedCategory ? (
              <span>{selectedCategory} Posts</span>
            ) : (
              <> <FaClock className="text-primary" /> Recent Posts </>
            )}
          </h2>

          <div className="max-w-2xl mx-auto">
            {displayedPosts.length > 0 ? (
              displayedPosts.map(post => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                <p className="text-2xl mb-2">📭</p>
                <p className="text-xl font-medium">এই ক্যাটাগরিতে এখনো কোনো পোস্ট নেই!</p>
                <Link to="/create-post" className="text-primary font-bold hover:underline mt-2 inline-block">প্রথম পোস্টটি তুমিই করো</Link>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- Floating Action Button (Create Post) --- */}
      <Link to="/create-post" className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-green-700 hover:scale-110 transition duration-300 z-50 group border-4 border-white/30">
        <FaPlus className="text-2xl group-hover:rotate-90 transition duration-300" />
      </Link>
    </div>
  );
};

export default Home;