

import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { FaImage, FaPaperPlane, FaTimes, FaSmile, FaGlobeAmericas, FaUserSecret } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import Swal from 'sweetalert2'; // ✅ SweetAlert Import

const CreatePost = () => {
  const navigate = useNavigate();
  const { dbUser } = useContext(AuthContext);
  
  // States
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  
  const emojiRef = useRef(null);
  const categories = ['Crush Confessions', 'Troll & Fun', 'Campus Sriti', 'Lost & Found'];
  const isAnonymous = category === 'Crush Confessions' || category === 'Troll & Fun';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = (emojiObject) => {
    setContent(prev => prev + emojiObject.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) return Swal.fire('Too Big!', 'File size max 10MB', 'error');
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dbUser) return Swal.fire('Oops!', 'Please Login First!', 'warning');
    if (!content.trim() && !image) return Swal.fire('Empty Post!', 'Write something or add an image!', 'info');

    setLoading(true);
    try {
      // 1. Image Upload Logic
      let imageUrl = "";
      if (image) {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "ebaub_preset"); 
        data.append("cloud_name", "dhbcgeyjy"); 

        const res = await fetch("https://api.cloudinary.com/v1_1/dhbcgeyjy/image/upload", {
          method: "POST",
          body: data
        });
        const file = await res.json();
        imageUrl = file.secure_url;
      }

      // 2. Save to Database
      const res = await fetch('https://ebaub-backend.vercel.app/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: dbUser._id,
          content,
          category,
          image: imageUrl
        })
      });

      if (res.ok) {
        // ✅ Beautiful Success Alert
        Swal.fire({
          title: 'Post Published! 🚀',
          text: 'Your post is now live on the feed.',
          icon: 'success',
          confirmButtonColor: '#16a34a',
          confirmButtonText: 'View Feed'
        }).then(() => {
          navigate('/'); // Redirect to Home
        });
      } else {
        Swal.fire('Failed!', 'Server Error. Try again later.', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Connection Error!', 'Check your internet connection.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Create New Post ✍️</h2>
          <p className="text-sm opacity-90">Share your thoughts with the campus!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* User Info & Category */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <img 
                src={isAnonymous ? "https://cdn-icons-png.flaticon.com/512/4333/4333609.png" : dbUser?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                className="w-12 h-12 rounded-full border-2 border-gray-200"
              />
              <div>
                <p className="font-bold text-gray-800">{isAnonymous ? "Secret User" : dbUser?.name || "Loading..."}</p>
                <div className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${isAnonymous ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                   {isAnonymous ? <><FaUserSecret /> Anonymous Mode</> : <><FaGlobeAmericas /> Public Mode</>}
                </div>
              </div>
            </div>

            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required 
              className="w-full md:w-1/2 p-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none font-medium text-gray-700 cursor-pointer"
            >
              <option value="">Select Category...</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Text Area & Emoji */}
          <div className="relative">
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder={`What's on your mind, ${dbUser?.name?.split(' ')[0] || 'User'}?`} 
              rows="6" 
              className="w-full p-4 text-lg border-2 border-gray-100 rounded-xl focus:border-primary outline-none resize-none bg-gray-50"
              required
            ></textarea>
            
            <span className="absolute bottom-4 right-4 text-xs text-gray-400">{content.length} chars</span>

            <button 
              type="button" 
              onClick={() => setShowEmoji(!showEmoji)} 
              className="absolute bottom-4 left-4 text-yellow-500 text-2xl hover:scale-110 transition bg-white rounded-full p-1 shadow-sm"
            >
              <FaSmile />
            </button>

            <AnimatePresence>
              {showEmoji && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  ref={emojiRef}
                  className="absolute bottom-16 left-0 z-50 shadow-2xl border rounded-xl"
                >
                  <EmojiPicker onEmojiClick={onEmojiClick} height={350} width={300} searchDisabled={true} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition relative group">
             {!preview ? (
               <>
                 <input type="file" id="postImg" className="hidden" accept="image/*" onChange={handleImageChange} />
                 <label htmlFor="postImg" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 group-hover:text-primary transition">
                   <div className="bg-gray-100 p-4 rounded-full group-hover:bg-green-50 transition">
                     <FaImage className="text-3xl" />
                   </div>
                   <span className="font-medium">Click to Add Photo</span>
                   <span className="text-xs text-gray-400">(Max 5MB)</span>
                 </label>
               </>
             ) : (
               <div className="relative inline-block">
                 <motion.img 
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   src={preview} 
                   alt="Preview" 
                   className="max-h-64 rounded-lg shadow-md" 
                 />
                 <button 
                   type="button" 
                   onClick={removeImage} 
                   className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition"
                 >
                   <FaTimes />
                 </button>
               </div>
             )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>Processing...</> 
            ) : (
              <><FaPaperPlane /> Post Now</>
            )}
          </button>

        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;