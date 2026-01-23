


// import { useState, useContext, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../providers/AuthProvider';
// import { FaImage, FaPaperPlane, FaTimes, FaSmile, FaGlobeAmericas, FaUserSecret } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import EmojiPicker from 'emoji-picker-react';
// import Swal from 'sweetalert2'; 

// const CreatePost = () => {
//   const navigate = useNavigate();
//   const { dbUser } = useContext(AuthContext);
  
//   // States
//   const [content, setContent] = useState('');
//   const [category, setCategory] = useState('');
  
//   // ✅ UPDATE: Multiple images support
//   const [selectedImages, setSelectedImages] = useState([]); 
//   const [imagePreviews, setImagePreviews] = useState([]);
  
//   const [loading, setLoading] = useState(false);
//   const [showEmoji, setShowEmoji] = useState(false);
  
//   const emojiRef = useRef(null);
//   const categories = ['Crush Confessions', 'Troll & Fun', 'Campus Sriti', 'Lost & Found'];
//   const isAnonymous = category === 'Crush Confessions' || category === 'Troll & Fun';

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (emojiRef.current && !emojiRef.current.contains(event.target)) {
//         setShowEmoji(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const onEmojiClick = (emojiObject) => {
//     setContent(prev => prev + emojiObject.emoji);
//   };

//   // ✅ UPDATE: Handle Multiple Files
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
    
//     // লিমিট চেক (সর্বোচ্চ ৫টা ছবি)
//     if (files.length + selectedImages.length > 5) {
//       return Swal.fire('Limit Exceeded', 'You can upload maximum 5 images', 'warning');
//     }

//     const newPreviews = files.map(file => URL.createObjectURL(file));
//     setSelectedImages([...selectedImages, ...files]);
//     setImagePreviews([...imagePreviews, ...newPreviews]);
//   };

//   // ✅ UPDATE: Remove specific image
//   const removeImage = (index) => {
//     const newImages = selectedImages.filter((_, i) => i !== index);
//     const newPreviews = imagePreviews.filter((_, i) => i !== index);
//     setSelectedImages(newImages);
//     setImagePreviews(newPreviews);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!dbUser) return Swal.fire('Oops!', 'Please Login First!', 'warning');
//     if (!content.trim() && selectedImages.length === 0) return Swal.fire('Empty Post!', 'Write something or add an image!', 'info');

//     setLoading(true);
//     try {
//       // ✅ 1. Upload Multiple Images Logic
//       let uploadedImageUrls = [];
      
//       if (selectedImages.length > 0) {
//         const uploadPromises = selectedImages.map(async (file) => {
//           const data = new FormData();
//           data.append("file", file);
//           data.append("upload_preset", "ebaub_preset"); 
//           data.append("cloud_name", "dhbcgeyjy"); 

//           const res = await fetch("https://api.cloudinary.com/v1_1/dhbcgeyjy/image/upload", {
//             method: "POST",
//             body: data
//           });
//           const fileData = await res.json();
//           return fileData.secure_url;
//         });

//         uploadedImageUrls = await Promise.all(uploadPromises);
//       }

//       // 2. Save to Database
//       const res = await fetch('https://ebaub-backend.vercel.app/api/posts', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           user: dbUser._id,
//           content,
//           category,
//           images: uploadedImageUrls, // ✅ Array sent to backend
//           image: uploadedImageUrls[0] || "" // Backward compatibility
//         })
//       });

//       if (res.ok) {
//         Swal.fire({
//           title: 'Post Published! 🚀',
//           text: 'Your post is now live on the feed.',
//           icon: 'success',
//           confirmButtonColor: '#16a34a',
//           confirmButtonText: 'View Feed'
//         }).then(() => {
//           navigate('/'); 
//         });
//       } else {
//         Swal.fire('Failed!', 'Server Error. Try again later.', 'error');
//       }
//     } catch (error) {
//       console.error(error);
//       Swal.fire('Connection Error!', 'Check your internet connection.', 'error');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 py-10">
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }} 
//         animate={{ opacity: 1, scale: 1 }} 
//         className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
//       >
//         {/* Header */}
//         <div className="bg-primary p-6 text-white text-center">
//           <h2 className="text-2xl font-bold">Create New Post ✍️</h2>
//           <p className="text-sm opacity-90">Share your thoughts with the campus!</p>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
//           {/* User Info & Category */}
//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//             <div className="flex items-center gap-3 w-full md:w-auto">
//               <img 
//                 src={isAnonymous ? "https://cdn-icons-png.flaticon.com/512/4333/4333609.png" : dbUser?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
//                 className="w-12 h-12 rounded-full border-2 border-gray-200"
//               />
//               <div>
//                 <p className="font-bold text-gray-800">{isAnonymous ? "Secret User" : dbUser?.name || "Loading..."}</p>
//                 <div className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${isAnonymous ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
//                    {isAnonymous ? <><FaUserSecret /> Anonymous Mode</> : <><FaGlobeAmericas /> Public Mode</>}
//                 </div>
//               </div>
//             </div>

//             <select 
//               value={category} 
//               onChange={(e) => setCategory(e.target.value)} 
//               required 
//               className="w-full md:w-1/2 p-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none font-medium text-gray-700 cursor-pointer"
//             >
//               <option value="">Select Category...</option>
//               {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//             </select>
//           </div>

//           {/* Text Area & Emoji */}
//           <div className="relative">
//             <textarea 
//               value={content} 
//               onChange={(e) => setContent(e.target.value)} 
//               placeholder={`What's on your mind, ${dbUser?.name?.split(' ')[0] || 'User'}?`} 
//               rows="6" 
//               className="w-full p-4 text-lg border-2 border-gray-100 rounded-xl focus:border-primary outline-none resize-none bg-gray-50"
//               required={selectedImages.length === 0}
//             ></textarea>
            
//             <span className="absolute bottom-4 right-4 text-xs text-gray-400">{content.length} chars</span>

//             <button 
//               type="button" 
//               onClick={() => setShowEmoji(!showEmoji)} 
//               className="absolute bottom-4 left-4 text-yellow-500 text-2xl hover:scale-110 transition bg-white rounded-full p-1 shadow-sm"
//             >
//               <FaSmile />
//             </button>

//             <AnimatePresence>
//               {showEmoji && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   ref={emojiRef}
//                   className="absolute bottom-16 left-0 z-50 shadow-2xl border rounded-xl"
//                 >
//                   <EmojiPicker onEmojiClick={onEmojiClick} height={350} width={300} searchDisabled={true} />
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* ✅ UPDATE: Multi Image Upload Area */}
//           <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition relative group">
//              {imagePreviews.length === 0 ? (
//                <>
//                  <input 
//                    type="file" 
//                    id="postImg" 
//                    className="hidden" 
//                    accept="image/*" 
//                    multiple // ✅ Allow multiple
//                    onChange={handleImageChange} 
//                  />
//                  <label htmlFor="postImg" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 group-hover:text-primary transition">
//                    <div className="bg-gray-100 p-4 rounded-full group-hover:bg-green-50 transition">
//                      <FaImage className="text-3xl" />
//                    </div>
//                    <span className="font-medium">Click to Add Photos (Max 5)</span>
//                    <span className="text-xs text-gray-400">(Max 5MB each)</span>
//                  </label>
//                </>
//              ) : (
//                <div className="grid grid-cols-3 gap-2">
//                  {/* ✅ Show Previews */}
//                  {imagePreviews.map((src, index) => (
//                    <div key={index} className="relative group/item">
//                      <img src={src} alt="Preview" className="h-24 w-full object-cover rounded-lg shadow-sm" />
//                      <button 
//                        type="button" 
//                        onClick={() => removeImage(index)} 
//                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition"
//                      >
//                        <FaTimes size={12}/>
//                      </button>
//                    </div>
//                  ))}
                 
//                  {/* Add More Button if less than 5 */}
//                  {imagePreviews.length < 5 && (
//                     <label htmlFor="postImgAddMore" className="flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 h-24">
//                         <FaImage className="text-gray-400" />
//                         <input type="file" id="postImgAddMore" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
//                     </label>
//                  )}
//                </div>
//              )}
//           </div>

//           {/* Submit Button */}
//           <button 
//             type="submit" 
//             disabled={loading} 
//             className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 disabled:bg-gray-400 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <>Processing...</> 
//             ) : (
//               <><FaPaperPlane /> Post Now</>
//             )}
//           </button>

//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default CreatePost;



import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { FaImage, FaPaperPlane, FaTimes, FaSmile, FaGlobeAmericas, FaUserSecret } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import Swal from 'sweetalert2'; 

const CreatePost = () => {
  const navigate = useNavigate();
  const { dbUser } = useContext(AuthContext);
  
  // States
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  
  // ✅ UPDATE: Multiple images support
  const [selectedImages, setSelectedImages] = useState([]); 
  const [imagePreviews, setImagePreviews] = useState([]);
  
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

  // ✅ UPDATE: Handle Multiple Files
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // লিমিট চেক (সর্বোচ্চ ৫টা ছবি)
    if (files.length + selectedImages.length > 5) {
      return Swal.fire('Limit Exceeded', 'You can upload maximum 5 images', 'warning');
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setSelectedImages([...selectedImages, ...files]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  // ✅ UPDATE: Remove specific image
  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dbUser) return Swal.fire('Oops!', 'Please Login First!', 'warning');

    // 🔥 NEW RESTRICTION LOGIC START
    if (dbUser.status !== 'approved') {
        return Swal.fire({
            icon: 'warning',
            title: 'Account Pending',
            text: 'আপনার অ্যাকাউন্ট এখনো অ্যাডমিন অ্যাপ্রুভ করেনি। অ্যাপ্রুভ হওয়ার পর পোস্ট করতে পারবেন।',
            confirmButtonColor: '#d33'
        });
    }
    // 🔥 NEW RESTRICTION LOGIC END

    if (!content.trim() && selectedImages.length === 0) return Swal.fire('Empty Post!', 'Write something or add an image!', 'info');

    setLoading(true);
    try {
      // ✅ 1. Upload Multiple Images Logic
      let uploadedImageUrls = [];
      
      if (selectedImages.length > 0) {
        const uploadPromises = selectedImages.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "ebaub_preset"); 
          data.append("cloud_name", "dhbcgeyjy"); 

          const res = await fetch("https://api.cloudinary.com/v1_1/dhbcgeyjy/image/upload", {
            method: "POST",
            body: data
          });
          const fileData = await res.json();
          return fileData.secure_url;
        });

        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      // 2. Save to Database
      const res = await fetch('https://ebaub-backend.vercel.app/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: dbUser._id,
          content,
          category,
          images: uploadedImageUrls, // ✅ Array sent to backend
          image: uploadedImageUrls[0] || "" // Backward compatibility
        })
      });

      if (res.ok) {
        Swal.fire({
          title: 'Post Submitted! ⏳',
          text: 'Your post is pending for admin approval.', // Message updated
          icon: 'success',
          confirmButtonColor: '#16a34a',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/'); 
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
              required={selectedImages.length === 0}
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

          {/* ✅ UPDATE: Multi Image Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition relative group">
              {imagePreviews.length === 0 ? (
                <>
                  <input 
                    type="file" 
                    id="postImg" 
                    className="hidden" 
                    accept="image/*" 
                    multiple // ✅ Allow multiple
                    onChange={handleImageChange} 
                  />
                  <label htmlFor="postImg" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 group-hover:text-primary transition">
                    <div className="bg-gray-100 p-4 rounded-full group-hover:bg-green-50 transition">
                      <FaImage className="text-3xl" />
                    </div>
                    <span className="font-medium">Click to Add Photos (Max 5)</span>
                    <span className="text-xs text-gray-400">(Max 5MB each)</span>
                  </label>
                </>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {/* ✅ Show Previews */}
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group/item">
                      <img src={src} alt="Preview" className="h-24 w-full object-cover rounded-lg shadow-sm" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition"
                      >
                        <FaTimes size={12}/>
                      </button>
                    </div>
                  ))}
                  
                  {/* Add More Button if less than 5 */}
                  {imagePreviews.length < 5 && (
                     <label htmlFor="postImgAddMore" className="flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 h-24">
                         <FaImage className="text-gray-400" />
                         <input type="file" id="postImgAddMore" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                     </label>
                  )}
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