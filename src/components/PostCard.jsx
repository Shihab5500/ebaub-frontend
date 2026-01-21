


// import { useState, useContext } from 'react';
// import { AuthContext } from '../providers/AuthProvider';
// import { motion } from 'framer-motion';
// import { FaHeart, FaRegHeart, FaComment, FaShare, FaPaperPlane, FaSmile, FaCopy } from 'react-icons/fa';
// import moment from 'moment';
// import EmojiPicker from 'emoji-picker-react'; // ইমোজি পিকার ইমপোর্ট

// const PostCard = ({ post }) => {
//   const { dbUser } = useContext(AuthContext);
//   const [currentPost, setCurrentPost] = useState(post);
  
//   // কমেন্ট বক্স এবং ইমোজি স্টেট
//   const [showCommentBox, setShowCommentBox] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   // 🛡️ Safety Check
//   const safePost = currentPost || {};
//   const likesArray = Array.isArray(safePost.likes) ? safePost.likes : [];
//   const commentsArray = Array.isArray(safePost.comments) ? safePost.comments : [];
//   const { user, content, category, image, createdAt } = safePost;
  
//   // Anonymous Logic
//   const isAnonymous = category === 'Crush Confessions' || category === 'Troll & Fun';
//   const displayName = isAnonymous ? "Secret Admirer 🤫" : user?.name || "Unknown";
//   const displayPic = isAnonymous 
//     ? "https://cdn-icons-png.flaticon.com/512/4333/4333609.png" 
//     : user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  
//   const isLiked = dbUser?._id && likesArray.includes(dbUser._id);

//   // --- Like Handler ---
//   const handleLike = async () => {
//     if (!dbUser) return alert("লাইক দিতে দয়া করে লগিন করুন!");
//     try {
//       const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}/like`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: dbUser._id })
//       });
//       if(res.ok) {
//         const updatedPost = await res.json();
//         setCurrentPost(prev => ({ 
//             ...prev, 
//             likes: Array.isArray(updatedPost.likes) ? updatedPost.likes : [] 
//         }));
//       }
//     } catch (err) { console.error("Like Error:", err); }
//   };

//   // --- Share Handler (Dynamic) ---
//   const handleShare = () => {
//     // পোস্টের লিংক তৈরি (আপাতত হোম লিংক + পোস্ট আইডি)
//     const shareUrl = `${window.location.origin}/post/${safePost._id}`; 
    
//     // ১. মোবাইলে থাকলে নেটিভ শেয়ার অপশন আসবে
//     if (navigator.share) {
//       navigator.share({
//         title: 'EBAUB Hub Post',
//         text: content.substring(0, 50) + '...',
//         url: shareUrl,
//       }).catch(err => console.log('Error sharing:', err));
//     } else {
//       // ২. পিসিতে থাকলে ক্লিপবোর্ডে কপি হবে
//       navigator.clipboard.writeText(shareUrl);
//       alert("লিংক কপি হয়েছে! 📋 now you can paste it anywhere.");
//     }
//   };

//   // --- Emoji Click Handler ---
//   const onEmojiClick = (emojiObject) => {
//     setCommentText(prev => prev + emojiObject.emoji);
//     // ইমোজি দেওয়ার পর পিকার বন্ধ করতে চাইলে নিচের লাইন আনকমেন্ট করো
//     // setShowEmojiPicker(false); 
//   };

//   // --- Comment Handler ---
//   const handleComment = async (e) => {
//     e.preventDefault();
//     if (!dbUser) return alert("কমেন্ট করতে দয়া করে লগিন করুন!");
//     if (!commentText.trim()) return;

//     try {
//       const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}/comment`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: dbUser._id, text: commentText })
//       });
//       if(res.ok){
//         const updatedPost = await res.json();
//         setCurrentPost(updatedPost); 
//         setCommentText(""); 
//         setShowEmojiPicker(false); // কমেন্ট সাবমিট হলে ইমোজি বক্স বন্ধ হবে
//       }
//     } catch (err) { console.error("Comment Error:", err); }
//   };

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-gray-100">
      
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-4">
//         <img src={displayPic} alt="Avatar" className="w-10 h-10 rounded-full border object-cover" />
//         <div>
//           <h3 className="font-bold text-gray-800">{displayName}</h3>
//           <div className="flex items-center gap-2 text-xs text-gray-500">
//             <span>{createdAt ? moment(createdAt).fromNow() : 'Just now'}</span> • 
//             <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${category === 'Crush Confessions' ? 'bg-pink-500' : 'bg-green-500'}`}>{category}</span>
//           </div>
//         </div>
//       </div>

//       <p className="text-gray-700 mb-4 whitespace-pre-line text-sm md:text-base">{content}</p>
//       {image && <div className="w-full h-auto max-h-96 overflow-hidden rounded-xl mb-4 bg-gray-50 border"><img src={image} alt="Post" className="w-full h-full object-contain" /></div>}

//       {/* Actions Buttons */}
//       <div className="flex justify-between border-t pt-3 text-gray-600 select-none">
//         <button onClick={handleLike} className={`flex items-center gap-2 transition ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
//           {isLiked ? <FaHeart /> : <FaRegHeart />} <span>{likesArray.length}</span>
//         </button>
        
//         <button onClick={() => setShowCommentBox(!showCommentBox)} className="flex items-center gap-2 hover:text-blue-500 transition">
//           <FaComment /> <span>{commentsArray.length}</span>
//         </button>
        
//         {/* Share Button Activated */}
//         <button onClick={handleShare} className="flex items-center gap-2 hover:text-green-600 transition">
//           <FaShare /> <span>Share</span>
//         </button>
//       </div>

//       {/* Comment Section with Emoji */}
//       {showCommentBox && (
//         <div className="mt-4 pt-4 border-t bg-gray-50 p-3 rounded-lg relative">
          
//           {/* Comments List */}
//           <div className="max-h-60 overflow-y-auto mb-4">
//             {commentsArray.length > 0 ? (
//               commentsArray.map((c, i) => (
//                 <div key={i} className="flex gap-2 mb-3 items-start">
//                   <img src={c.user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full border bg-white" />
//                   <div className="bg-white p-2 rounded-lg text-sm w-full shadow-sm border">
//                     <p className="font-bold text-gray-800 text-xs">{c.user?.name || "Unknown"}</p>
//                     <p className="text-gray-600">{c.text}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-xs text-gray-400 text-center mb-2">No comments yet.</p>
//             )}
//           </div>

//           {/* Comment Input Area */}
//           <form onSubmit={handleComment} className="flex items-center gap-2 relative">
            
//             {/* Emoji Picker Pop-up */}
//             {showEmojiPicker && (
//               <div className="absolute bottom-12 left-0 z-50 shadow-2xl">
//                 <EmojiPicker 
//                   onEmojiClick={onEmojiClick} 
//                   height={350} 
//                   width={300}
//                   searchDisabled={true} // সিম্পল রাখার জন্য সার্চ বন্ধ (চাইলে অন করতে পারো)
//                 />
//               </div>
//             )}

//             {/* Emoji Toggle Button */}
//             <button 
//               type="button" 
//               onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//               className="text-yellow-500 text-xl hover:scale-110 transition p-2 bg-white rounded-full border"
//             >
//               <FaSmile />
//             </button>

//             <input 
//                 type="text" 
//                 value={commentText} 
//                 onChange={e => setCommentText(e.target.value)} 
//                 placeholder="Write a comment..." 
//                 className="w-full border p-2 rounded-full px-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
//             />
            
//             <button type="submit" className="bg-primary text-white p-2 rounded-full hover:bg-green-700 transition">
//                 <FaPaperPlane />
//             </button>
//           </form>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default PostCard;

// import { useState, useContext, useRef } from 'react';
// import { AuthContext } from '../providers/AuthProvider';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaComment, FaShare, FaPaperPlane, FaSmile, FaEllipsisH, FaTrash, FaEdit, FaSave } from 'react-icons/fa';
// import moment from 'moment';
// import EmojiPicker from 'emoji-picker-react';
// import Swal from 'sweetalert2';
// import toast from 'react-hot-toast';

// const reactionsMap = {
//   like: '👍',
//   love: '❤️',
//   haha: '😂',
//   wow: '😮',
//   sad: '😢',
//   angry: '😡'
// };

// const PostCard = ({ post }) => {
//   const { dbUser } = useContext(AuthContext);
//   const [currentPost, setCurrentPost] = useState(post);
  
//   // UI States
//   const [showCommentBox, setShowCommentBox] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showReactions, setShowReactions] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(post.content);
  
//   const timerRef = useRef(null);
//   const isLongPress = useRef(false);

//   const safePost = currentPost || {};
//   const reactionsArray = Array.isArray(safePost.reactions) ? safePost.reactions : [];
//   const commentsArray = Array.isArray(safePost.comments) ? safePost.comments : [];
//   const { user, content, category, image, createdAt } = safePost;
  
//   const isAnonymous = category === 'Crush Confessions' || category === 'Troll & Fun';
//   const displayName = isAnonymous ? "Secret Admirer 🤫" : user?.name || "Unknown";
//   const displayPic = isAnonymous 
//     ? "https://cdn-icons-png.flaticon.com/512/4333/4333609.png" 
//     : user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  
//   const myReaction = reactionsArray.find(r => r.user === dbUser?._id);

//   // --- Handlers ---

//   const handleReact = async (type) => {
//     if (!dbUser) return toast.error("Please Login First!");
//     setShowReactions(false);
//     try {
//       const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}/react`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: dbUser._id, type })
//       });
//       if(res.ok) {
//         const updatedPost = await res.json();
//         setCurrentPost(updatedPost);
//         if(navigator.vibrate) navigator.vibrate(50);
//       }
//     } catch (err) { console.error("React Error:", err); }
//   };

//   const handleDeleteComment = async (commentId) => {
//     const result = await Swal.fire({
//       title: 'Delete this comment?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete!',
//       cancelButtonText: 'Cancel',
//       // বাটন কালার এবং ভিজিবিলিটি ফিক্স
//       customClass: {
//         popup: 'rounded-xl',
//         confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 mx-2',
//         cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 mx-2'
//       },
//       buttonsStyling: false
//     });

//     if (result.isConfirmed) {
//       try {
//         const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}/comments/${commentId}`, {
//           method: 'DELETE',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId: dbUser._id })
//         });

//         if (res.ok) {
//           const updatedPost = await res.json();
//           setCurrentPost(updatedPost);
//           toast.success("Comment deleted");
//         }
//       } catch (err) { toast.error("Failed to delete"); }
//     }
//   };

//   const handleDelete = async () => {
//     const result = await Swal.fire({
//       title: 'Delete Post?',
//       text: "This cannot be undone!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete!',
//       cancelButtonText: 'Cancel',
//       customClass: {
//         popup: 'rounded-xl',
//         confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 mx-2',
//         cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 mx-2'
//       },
//       buttonsStyling: false
//     });

//     if (result.isConfirmed) {
//       try {
//         await fetch(`http://localhost:5000/api/posts/${safePost._id}`, { method: 'DELETE' });
//         setCurrentPost(null);
//         Swal.fire({
//             title: 'Deleted!',
//             icon: 'success',
//             customClass: { confirmButton: 'bg-green-600 text-white px-4 py-2 rounded-lg' },
//             buttonsStyling: false
//         });
//       } catch (err) { toast.error("Failed to delete"); }
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ content: editContent })
//       });
//       if (res.ok) {
//         const updated = await res.json();
//         setCurrentPost(updated);
//         setIsEditing(false);
//         toast.success("Updated Successfully");
//       }
//     } catch (err) { toast.error("Failed to update"); }
//   };

//   const handleComment = async (e) => {
//     e.preventDefault();
//     if (!dbUser) return toast.error("Login First!");
//     if (!commentText.trim()) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}/comment`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: dbUser._id, text: commentText })
//       });
//       if(res.ok){ 
//         const updatedPost = await res.json(); 
//         setCurrentPost(updatedPost); 
//         setCommentText(""); 
//         setShowEmojiPicker(false);
//         toast.success("Comment Added");
//       }
//     } catch (err) { toast.error("Failed to comment"); }
//   };

//   const handleShare = async () => {
//     const shareUrl = `${window.location.origin}`; 
//     try { await navigator.clipboard.writeText(shareUrl); toast.success("Link Copied!"); } 
//     catch (err) { toast.error("Copy Failed"); }
//   };

//   const handlePressStart = () => {
//     isLongPress.current = false;
//     timerRef.current = setTimeout(() => { isLongPress.current = true; setShowReactions(true); if (navigator.vibrate) navigator.vibrate(50); }, 500);
//   };
//   const handlePressEnd = () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   const handleMainButtonAction = () => { if (isLongPress.current) return; handleReact(myReaction ? myReaction.type : 'like'); };

//   if (!currentPost) return null;
//   const canModify = dbUser && (dbUser._id === user?._id || dbUser.role === 'admin');

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-gray-100 relative">
      
//       {/* 3-DOT MENU */}
//       {canModify && (
//         <div className="absolute top-4 right-4 z-20">
//           <button onClick={() => setShowMenu(!showMenu)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"><FaEllipsisH /></button>
//           {showMenu && (
//             <div className="absolute right-0 mt-2 w-36 bg-white shadow-xl rounded-lg border overflow-hidden py-1 z-30 animate-fadeIn">
//               <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm flex items-center gap-2 text-gray-700"><FaEdit /> Edit Post</button>
//               <button onClick={handleDelete} className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm flex items-center gap-2 text-red-600"><FaTrash /> Delete</button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex items-center gap-3 mb-4">
//         <img src={displayPic} alt="Avatar" className="w-10 h-10 rounded-full border object-cover" />
//         <div>
//           <h3 className="font-bold text-gray-800">{displayName}</h3>
//           <div className="flex items-center gap-2 text-xs text-gray-500">
//             <span>{createdAt ? moment(createdAt).fromNow() : 'Just now'}</span> • 
//             <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${category === 'Crush Confessions' ? 'bg-pink-500' : 'bg-green-500'}`}>{category}</span>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       {isEditing ? (
//         <div className="mb-4">
//           <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full border p-2 rounded-lg focus:border-primary outline-none bg-gray-50" rows="3"/>
//           <div className="flex gap-2 mt-2 justify-end">
//             <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-300 rounded text-sm font-bold">Cancel</button>
//             <button onClick={handleUpdate} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1"><FaSave/> Save</button>
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-700 mb-4 whitespace-pre-line text-sm md:text-base">{content}</p>
//       )}

//       {image && (
//         <div className="w-full h-auto max-h-96 overflow-hidden rounded-xl mb-4 bg-gray-50 border">
//             <img src={image.replace('/upload/', '/upload/w_800,q_auto,f_auto/')} alt="Post" className="w-full h-full object-contain" loading="lazy"/>
//         </div>
//       )}

//       {/* --- ACTION BAR --- */}
//       <div className="flex justify-between border-t pt-3 text-gray-600 relative select-none">
//         <div className="relative" onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
//           <AnimatePresence>
//             {showReactions && (
//               <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -50, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }} className="absolute left-0 bottom-full mb-2 bg-white shadow-2xl rounded-full px-3 py-2 flex gap-3 border z-20">
//                 {Object.keys(reactionsMap).map((key) => (
//                   <button key={key} onClick={() => handleReact(key)} className="text-2xl hover:scale-125 transition duration-200 transform">{reactionsMap[key]}</button>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>
//           <button onTouchStart={handlePressStart} onTouchEnd={handlePressEnd} onMouseDown={handlePressStart} onMouseUp={handlePressEnd} onClick={handleMainButtonAction} className={`flex items-center gap-2 transition px-2 py-1 rounded-lg hover:bg-gray-100 active:bg-gray-200 ${myReaction ? 'text-blue-600 font-bold' : ''}`}>
//             <span className="text-xl">{myReaction ? reactionsMap[myReaction.type] : '👍'}</span>
//             <span>{myReaction ? myReaction.type.charAt(0).toUpperCase() + myReaction.type.slice(1) : 'Like'} <span className="ml-1 text-gray-500 font-normal">({reactionsArray.length})</span></span>
//           </button>
//         </div>
        
//         <button onClick={() => setShowCommentBox(!showCommentBox)} className="flex items-center gap-2 hover:text-blue-500 transition px-2 py-1 rounded-lg hover:bg-gray-100">
//           <FaComment /> <span>{commentsArray.length}</span>
//         </button>
//         <button onClick={handleShare} className="flex items-center gap-2 hover:text-gray-800 transition px-2 py-1 rounded-lg hover:bg-gray-100">
//           <FaShare /> Share
//         </button>
//       </div>

//       {/* --- COMMENTS AREA --- */}
//       {showCommentBox && (
//         <div className="mt-4 pt-4 border-t bg-gray-50 p-3 rounded-lg relative">
//           <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
//             {commentsArray.length === 0 && <p className="text-center text-gray-400 text-sm">No comments yet. Be the first!</p>}
            
//             {commentsArray.map((c, i) => (
//               <div key={i} className="flex gap-2 items-start group">
//                 <img src={c.user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full border bg-white" />
//                 <div className="flex-1">
//                   <div className="bg-white p-2 rounded-2xl text-sm shadow-sm border inline-block pr-4 relative">
//                     <p className="font-bold text-gray-800 text-xs">{c.user?.name || "Unknown"}</p>
//                     <p className="text-gray-700">{c.text}</p>
//                   </div>
//                   <div className="text-[10px] text-gray-400 ml-2 mt-1 flex items-center gap-3">
//                     <span>{moment(c.createdAt).fromNow()}</span>
//                     {dbUser && (dbUser._id === c.user?._id || dbUser.role === 'admin' || dbUser.role === 'moderator') && (
//                       <button onClick={() => handleDeleteComment(c._id)} className="text-red-400 hover:text-red-600 font-bold cursor-pointer hover:underline">Delete</button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <form onSubmit={handleComment} className="flex items-center gap-2 relative">
//              {showEmojiPicker && <div className="absolute bottom-12 left-0 z-50 shadow-2xl"><EmojiPicker onEmojiClick={(e) => setCommentText(prev => prev + e.emoji)} height={300} width={280} searchDisabled={true}/></div>}
//             <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-yellow-500 text-xl hover:scale-110 transition p-2 bg-white rounded-full border"><FaSmile /></button>
//             <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a comment..." className="w-full border p-2 rounded-full px-4 outline-none focus:border-primary text-sm"/>
//             <button type="submit" className="bg-primary text-white p-2 rounded-full"><FaPaperPlane /></button>
//           </form>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default PostCard;


// import { useState, useContext, useRef } from 'react';
// import { AuthContext } from '../providers/AuthProvider';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaComment, FaShare, FaPaperPlane, FaSmile, FaEllipsisH, FaTrash, FaEdit, FaSave } from 'react-icons/fa';
// import moment from 'moment';
// import EmojiPicker from 'emoji-picker-react';
// import Swal from 'sweetalert2';
// import toast from 'react-hot-toast';

// const reactionsMap = {
//   like: '👍',
//   love: '❤️',
//   haha: '😂',
//   wow: '😮',
//   sad: '😢',
//   angry: '😡'
// };

// const PostCard = ({ post }) => {
//   const { dbUser } = useContext(AuthContext);
//   const [currentPost, setCurrentPost] = useState(post);
  
//   // UI States
//   const [showCommentBox, setShowCommentBox] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [showReactions, setShowReactions] = useState(false);
  
//   // Edit & Text Expansion States
//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(post.content);
  
//   // 🔥 New State for See More
//   const [isExpanded, setIsExpanded] = useState(false); 

//   const timerRef = useRef(null);
//   const isLongPress = useRef(false);

//   // Data Safety
//   const safePost = currentPost || {};
//   const reactionsArray = Array.isArray(safePost.reactions) ? safePost.reactions : [];
//   const commentsArray = Array.isArray(safePost.comments) ? safePost.comments : [];
//   const { user, content, category, image, createdAt } = safePost;
  
//   const isAnonymous = category === 'Crush Confessions' || category === 'Troll & Fun';
//   const displayName = isAnonymous ? "Secret Admirer 🤫" : user?.name || "Unknown";
//   const displayPic = isAnonymous 
//     ? "https://cdn-icons-png.flaticon.com/512/4333/4333609.png" 
//     : user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  
//   const myReaction = reactionsArray.find(r => r.user === dbUser?._id);

//   // --- 🔥 Logic for See More / Responsive Text ---
//   const textLimit = 150; // ১৫০ ক্যারেক্টারের বেশি হলে See More দেখাবে
//   const isLongText = content?.length > textLimit;
  
//   // যদি Expand করা থাকে তবে পুরোটা, না থাকলে ১৫০ অক্ষর দেখাবে
//   const displayContent = isExpanded ? content : content?.slice(0, textLimit);

//   // --- Handlers ---

//   const handleReact = async (type) => {
//     if (!dbUser) return toast.error("Please Login First!");
//     setShowReactions(false);
//     try {
//       const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}/react`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: dbUser._id, type })
//       });
//       if(res.ok) {
//         const updatedPost = await res.json();
//         setCurrentPost(updatedPost);
//         if(navigator.vibrate) navigator.vibrate(50);
//       }
//     } catch (err) { console.error("React Error:", err); }
//   };

//   const handleDeleteComment = async (commentId) => {
//     const result = await Swal.fire({
//       title: 'Delete this comment?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete!',
//       cancelButtonText: 'Cancel',
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//     });

//     if (result.isConfirmed) {
//       try {
//         const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}/comments/${commentId}`, {
//           method: 'DELETE',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ userId: dbUser._id })
//         });

//         if (res.ok) {
//           const updatedPost = await res.json();
//           setCurrentPost(updatedPost);
//           toast.success("Comment deleted");
//         }
//       } catch (err) { toast.error("Failed to delete"); }
//     }
//   };

//   const handleDelete = async () => {
//     const result = await Swal.fire({
//       title: 'Delete Post?',
//       text: "This cannot be undone!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete!',
//       cancelButtonText: 'Cancel',
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//     });

//     if (result.isConfirmed) {
//       try {
//         await fetch(`http://localhost:5000/api/posts/${safePost._id}`, { method: 'DELETE' });
//         setCurrentPost(null);
//         Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
//       } catch (err) { toast.error("Failed to delete"); }
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ content: editContent })
//       });
//       if (res.ok) {
//         const updated = await res.json();
//         setCurrentPost(updated);
//         setIsEditing(false);
//         toast.success("Updated Successfully");
//       }
//     } catch (err) { toast.error("Failed to update"); }
//   };

//   const handleComment = async (e) => {
//     e.preventDefault();
//     if (!dbUser) return toast.error("Login First!");
//     if (!commentText.trim()) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}/comment`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId: dbUser._id, text: commentText })
//       });
//       if(res.ok){ 
//         const updatedPost = await res.json(); 
//         setCurrentPost(updatedPost); 
//         setCommentText(""); 
//         setShowEmojiPicker(false);
//         toast.success("Comment Added");
//       }
//     } catch (err) { toast.error("Failed to comment"); }
//   };

//   const handleShare = async () => {
//     const shareUrl = `${window.location.origin}`; 
//     try { await navigator.clipboard.writeText(shareUrl); toast.success("Link Copied!"); } 
//     catch (err) { toast.error("Copy Failed"); }
//   };

//   const handlePressStart = () => {
//     isLongPress.current = false;
//     timerRef.current = setTimeout(() => { isLongPress.current = true; setShowReactions(true); if (navigator.vibrate) navigator.vibrate(50); }, 500);
//   };
//   const handlePressEnd = () => { if (timerRef.current) clearTimeout(timerRef.current); };
//   const handleMainButtonAction = () => { if (isLongPress.current) return; handleReact(myReaction ? myReaction.type : 'like'); };

//   if (!currentPost) return null;
//   const canModify = dbUser && (dbUser._id === user?._id || dbUser.role === 'admin');

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-gray-100 relative w-full max-w-full overflow-hidden">
      
//       {/* 3-DOT MENU */}
//       {canModify && (
//         <div className="absolute top-4 right-4 z-20">
//           <button onClick={() => setShowMenu(!showMenu)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"><FaEllipsisH /></button>
//           {showMenu && (
//             <div className="absolute right-0 mt-2 w-36 bg-white shadow-xl rounded-lg border overflow-hidden py-1 z-30 animate-fadeIn">
//               <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm flex items-center gap-2 text-gray-700"><FaEdit /> Edit Post</button>
//               <button onClick={handleDelete} className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm flex items-center gap-2 text-red-600"><FaTrash /> Delete</button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex items-center gap-3 mb-4">
//         <img src={displayPic} alt="Avatar" className="w-10 h-10 rounded-full border object-cover" />
//         <div>
//           <h3 className="font-bold text-gray-800">{displayName}</h3>
//           <div className="flex items-center gap-2 text-xs text-gray-500">
//             <span>{createdAt ? moment(createdAt).fromNow() : 'Just now'}</span> • 
//             <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${category === 'Crush Confessions' ? 'bg-pink-500' : 'bg-green-500'}`}>{category}</span>
//           </div>
//         </div>
//       </div>

//       {/* --- 🔥 CONTENT SECTION (Updated for See More & Responsive) --- */}
//       {isEditing ? (
//         <div className="mb-4">
//           <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full border p-2 rounded-lg focus:border-primary outline-none bg-gray-50" rows="3"/>
//           <div className="flex gap-2 mt-2 justify-end">
//             <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-300 rounded text-sm font-bold">Cancel</button>
//             <button onClick={handleUpdate} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1"><FaSave/> Save</button>
//           </div>
//         </div>
//       ) : (
//         <div className="mb-4 text-gray-700 text-sm md:text-base">
//           {/* break-words এবং overflowWrap নিশ্চিত করবে যেন লম্বা শব্দ ভেঙে নিচে নামে */}
//           <p className="whitespace-pre-wrap break-words" style={{ overflowWrap: 'anywhere' }}>
//             {displayContent}
//             {isLongText && !isExpanded && "..."}
            
//             {/* See More Toggle Button */}
//             {isLongText && (
//               <span 
//                 onClick={() => setIsExpanded(!isExpanded)} 
//                 className="text-gray-500 font-bold cursor-pointer ml-1 hover:underline select-none"
//               >
//                 {isExpanded ? " See Less" : " See More"}
//               </span>
//             )}
//           </p>
//         </div>
//       )}

//       {/* Image */}
//       {image && (
//         <div className="w-full h-auto max-h-96 overflow-hidden rounded-xl mb-4 bg-gray-50 border">
//             <img src={image.replace('/upload/', '/upload/w_800,q_auto,f_auto/')} alt="Post" className="w-full h-full object-contain" loading="lazy"/>
//         </div>
//       )}

//       {/* --- ACTION BAR --- */}
//       <div className="flex justify-between border-t pt-3 text-gray-600 relative select-none">
//         <div className="relative" onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
//           <AnimatePresence>
//             {showReactions && (
//               <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -50, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }} className="absolute left-0 bottom-full mb-2 bg-white shadow-2xl rounded-full px-3 py-2 flex gap-3 border z-20">
//                 {Object.keys(reactionsMap).map((key) => (
//                   <button key={key} onClick={() => handleReact(key)} className="text-2xl hover:scale-125 transition duration-200 transform">{reactionsMap[key]}</button>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>
//           <button onTouchStart={handlePressStart} onTouchEnd={handlePressEnd} onMouseDown={handlePressStart} onMouseUp={handlePressEnd} onClick={handleMainButtonAction} className={`flex items-center gap-2 transition px-2 py-1 rounded-lg hover:bg-gray-100 active:bg-gray-200 ${myReaction ? 'text-blue-600 font-bold' : ''}`}>
//             <span className="text-xl">{myReaction ? reactionsMap[myReaction.type] : '👍'}</span>
//             <span>{myReaction ? myReaction.type.charAt(0).toUpperCase() + myReaction.type.slice(1) : 'Like'} <span className="ml-1 text-gray-500 font-normal">({reactionsArray.length})</span></span>
//           </button>
//         </div>
        
//         <button onClick={() => setShowCommentBox(!showCommentBox)} className="flex items-center gap-2 hover:text-blue-500 transition px-2 py-1 rounded-lg hover:bg-gray-100">
//           <FaComment /> <span>{commentsArray.length}</span>
//         </button>
//         <button onClick={handleShare} className="flex items-center gap-2 hover:text-gray-800 transition px-2 py-1 rounded-lg hover:bg-gray-100">
//           <FaShare /> Share
//         </button>
//       </div>

//       {/* --- COMMENTS AREA (Updated for Responsive Text) --- */}
//       {showCommentBox && (
//         <div className="mt-4 pt-4 border-t bg-gray-50 p-3 rounded-lg relative">
//           <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
//             {commentsArray.length === 0 && <p className="text-center text-gray-400 text-sm">No comments yet. Be the first!</p>}
            
//             {commentsArray.map((c, i) => (
//               <div key={i} className="flex gap-2 items-start group">
//                 <img src={c.user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full border bg-white" />
                
//                 {/* min-w-0 কমেন্টের ওভারফ্লো আটকাবে */}
//                 <div className="flex-1 min-w-0"> 
//                   <div className="bg-white p-2 rounded-2xl text-sm shadow-sm border inline-block pr-4 relative max-w-full">
//                     <p className="font-bold text-gray-800 text-xs">{c.user?.name || "Unknown"}</p>
//                     {/* কমেন্টেও ব্রেক ওয়ার্ডস লজিক */}
//                     <p className="text-gray-700 break-words whitespace-pre-wrap" style={{ overflowWrap: 'anywhere' }}>{c.text}</p>
//                   </div>
//                   <div className="text-[10px] text-gray-400 ml-2 mt-1 flex items-center gap-3">
//                     <span>{moment(c.createdAt).fromNow()}</span>
//                     {dbUser && (dbUser._id === c.user?._id || dbUser.role === 'admin' || dbUser.role === 'moderator') && (
//                       <button onClick={() => handleDeleteComment(c._id)} className="text-red-400 hover:text-red-600 font-bold cursor-pointer hover:underline">Delete</button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <form onSubmit={handleComment} className="flex items-center gap-2 relative">
//              {showEmojiPicker && <div className="absolute bottom-12 left-0 z-50 shadow-2xl"><EmojiPicker onEmojiClick={(e) => setCommentText(prev => prev + e.emoji)} height={300} width={280} searchDisabled={true}/></div>}
//             <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-yellow-500 text-xl hover:scale-110 transition p-2 bg-white rounded-full border"><FaSmile /></button>
//             <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a comment..." className="w-full border p-2 rounded-full px-4 outline-none focus:border-primary text-sm"/>
//             <button type="submit" className="bg-primary text-white p-2 rounded-full"><FaPaperPlane /></button>
//           </form>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default PostCard;


import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComment, FaShare, FaPaperPlane, FaSmile, FaEllipsisH, FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const reactionsMap = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😡'
};

const PostCard = ({ post }) => {
  const { dbUser } = useContext(AuthContext);
  const [currentPost, setCurrentPost] = useState(post);
  
  // UI States
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  
  // Edit & Text Expansion States
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  
  // 🔥 New State for See More
  const [isExpanded, setIsExpanded] = useState(false); 

  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  // Data Safety
  const safePost = currentPost || {};
  const reactionsArray = Array.isArray(safePost.reactions) ? safePost.reactions : [];
  const commentsArray = Array.isArray(safePost.comments) ? safePost.comments : [];
  const { user, content, category, image, createdAt } = safePost;
  
  const isAnonymous = category === 'Crush Confessions' || category === 'Troll & Fun';
  const displayName = isAnonymous ? "Secret Admirer 🤫" : user?.name || "Unknown";
  const displayPic = isAnonymous 
    ? "https://cdn-icons-png.flaticon.com/512/4333/4333609.png" 
    : user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  
  const myReaction = reactionsArray.find(r => r.user === dbUser?._id);

  // --- 🔥 Logic for See More / Responsive Text ---
  const textLimit = 150; // ১৫০ ক্যারেক্টারের বেশি হলে See More দেখাবে
  const isLongText = content?.length > textLimit;
  
  // যদি Expand করা থাকে তবে পুরোটা, না থাকলে ১৫০ অক্ষর দেখাবে
  const displayContent = isExpanded ? content : content?.slice(0, textLimit);

  // --- Handlers ---

  const handleReact = async (type) => {
    if (!dbUser) return toast.error("Please Login First!");
    setShowReactions(false);
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}/react`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: dbUser._id, type })
      });
      if(res.ok) {
        const updatedPost = await res.json();
        setCurrentPost(updatedPost);
        if(navigator.vibrate) navigator.vibrate(50);
      }
    } catch (err) { console.error("React Error:", err); }
  };

  // 🔥 FIX: ডিলিট কমেন্ট বাটন ফিক্স
  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: 'Delete this comment?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
      // বাটন স্টাইলিং ফিক্স (Tailwind Class ব্যবহার করা হয়েছে)
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 mx-2',
        cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 mx-2'
      },
      buttonsStyling: false // ডিফল্ট স্টাইল বন্ধ করে দেওয়া হয়েছে
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}/comments/${commentId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: dbUser._id })
        });

        if (res.ok) {
          const updatedPost = await res.json();
          setCurrentPost(updatedPost);
          toast.success("Comment deleted");
        }
      } catch (err) { toast.error("Failed to delete"); }
    }
  };

  // 🔥 FIX: ডিলিট পোস্ট বাটন ফিক্স
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete Post?',
      text: "This cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
      // বাটন স্টাইলিং ফিক্স
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 mx-2',
        cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 mx-2'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:5000/api/posts/${safePost._id}`, { method: 'DELETE' });
        setCurrentPost(null);
        Swal.fire({
            title: "Deleted!",
            icon: "success",
            customClass: {
                confirmButton: 'bg-green-600 text-white px-4 py-2 rounded-lg font-bold'
            },
            buttonsStyling: false
        });
      } catch (err) { toast.error("Failed to delete"); }
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentPost(updated);
        setIsEditing(false);
        toast.success("Updated Successfully");
      }
    } catch (err) { toast.error("Failed to update"); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!dbUser) return toast.error("Login First!");
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${safePost._id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: dbUser._id, text: commentText })
      });
      if(res.ok){ 
        const updatedPost = await res.json(); 
        setCurrentPost(updatedPost); 
        setCommentText(""); 
        setShowEmojiPicker(false);
        toast.success("Comment Added");
      }
    } catch (err) { toast.error("Failed to comment"); }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}`; 
    try { await navigator.clipboard.writeText(shareUrl); toast.success("Link Copied!"); } 
    catch (err) { toast.error("Copy Failed"); }
  };

  const handlePressStart = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => { isLongPress.current = true; setShowReactions(true); if (navigator.vibrate) navigator.vibrate(50); }, 500);
  };
  const handlePressEnd = () => { if (timerRef.current) clearTimeout(timerRef.current); };
  const handleMainButtonAction = () => { if (isLongPress.current) return; handleReact(myReaction ? myReaction.type : 'like'); };

  if (!currentPost) return null;
  const canModify = dbUser && (dbUser._id === user?._id || dbUser.role === 'admin');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-gray-100 relative w-full max-w-full overflow-hidden">
      
      {/* 3-DOT MENU */}
      {canModify && (
        <div className="absolute top-4 right-4 z-20">
          <button onClick={() => setShowMenu(!showMenu)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"><FaEllipsisH /></button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white shadow-xl rounded-lg border overflow-hidden py-1 z-30 animate-fadeIn">
              <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm flex items-center gap-2 text-gray-700"><FaEdit /> Edit Post</button>
              <button onClick={handleDelete} className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm flex items-center gap-2 text-red-600"><FaTrash /> Delete</button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img src={displayPic} alt="Avatar" className="w-10 h-10 rounded-full border object-cover" />
        <div>
          <h3 className="font-bold text-gray-800">{displayName}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{createdAt ? moment(createdAt).fromNow() : 'Just now'}</span> • 
            <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${category === 'Crush Confessions' ? 'bg-pink-500' : 'bg-green-500'}`}>{category}</span>
          </div>
        </div>
      </div>

      {/* --- 🔥 CONTENT SECTION (Updated for See More & Responsive) --- */}
      {isEditing ? (
        <div className="mb-4">
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full border p-2 rounded-lg focus:border-primary outline-none bg-gray-50" rows="3"/>
          <div className="flex gap-2 mt-2 justify-end">
            <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-300 rounded text-sm font-bold">Cancel</button>
            <button onClick={handleUpdate} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1"><FaSave/> Save</button>
          </div>
        </div>
      ) : (
        <div className="mb-4 text-gray-700 text-sm md:text-base">
          {/* break-words এবং overflowWrap নিশ্চিত করবে যেন লম্বা শব্দ ভেঙে নিচে নামে */}
          <p className="whitespace-pre-wrap break-words" style={{ overflowWrap: 'anywhere' }}>
            {displayContent}
            {isLongText && !isExpanded && "..."}
            
            {/* See More Toggle Button */}
            {isLongText && (
              <span 
                onClick={() => setIsExpanded(!isExpanded)} 
                className="text-gray-500 font-bold cursor-pointer ml-1 hover:underline select-none"
              >
                {isExpanded ? " See Less" : " See More"}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Image */}
      {image && (
        <div className="w-full h-auto max-h-96 overflow-hidden rounded-xl mb-4 bg-gray-50 border">
            <img src={image.replace('/upload/', '/upload/w_800,q_auto,f_auto/')} alt="Post" className="w-full h-full object-contain" loading="lazy"/>
        </div>
      )}

      {/* --- ACTION BAR --- */}
      <div className="flex justify-between border-t pt-3 text-gray-600 relative select-none">
        <div className="relative" onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
          <AnimatePresence>
            {showReactions && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -50, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }} className="absolute left-0 bottom-full mb-2 bg-white shadow-2xl rounded-full px-3 py-2 flex gap-3 border z-20">
                {Object.keys(reactionsMap).map((key) => (
                  <button key={key} onClick={() => handleReact(key)} className="text-2xl hover:scale-125 transition duration-200 transform">{reactionsMap[key]}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <button onTouchStart={handlePressStart} onTouchEnd={handlePressEnd} onMouseDown={handlePressStart} onMouseUp={handlePressEnd} onClick={handleMainButtonAction} className={`flex items-center gap-2 transition px-2 py-1 rounded-lg hover:bg-gray-100 active:bg-gray-200 ${myReaction ? 'text-blue-600 font-bold' : ''}`}>
            <span className="text-xl">{myReaction ? reactionsMap[myReaction.type] : '👍'}</span>
            <span>{myReaction ? myReaction.type.charAt(0).toUpperCase() + myReaction.type.slice(1) : 'Like'} <span className="ml-1 text-gray-500 font-normal">({reactionsArray.length})</span></span>
          </button>
        </div>
        
        <button onClick={() => setShowCommentBox(!showCommentBox)} className="flex items-center gap-2 hover:text-blue-500 transition px-2 py-1 rounded-lg hover:bg-gray-100">
          <FaComment /> <span>{commentsArray.length}</span>
        </button>
        <button onClick={handleShare} className="flex items-center gap-2 hover:text-gray-800 transition px-2 py-1 rounded-lg hover:bg-gray-100">
          <FaShare /> Share
        </button>
      </div>

      {/* --- COMMENTS AREA (Updated for Responsive Text) --- */}
      {showCommentBox && (
        <div className="mt-4 pt-4 border-t bg-gray-50 p-3 rounded-lg relative">
          <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
            {commentsArray.length === 0 && <p className="text-center text-gray-400 text-sm">No comments yet. Be the first!</p>}
            
            {commentsArray.map((c, i) => (
              <div key={i} className="flex gap-2 items-start group">
                <img src={c.user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full border bg-white" />
                
                {/* min-w-0 কমেন্টের ওভারফ্লো আটকাবে */}
                <div className="flex-1 min-w-0"> 
                  <div className="bg-white p-2 rounded-2xl text-sm shadow-sm border inline-block pr-4 relative max-w-full">
                    <p className="font-bold text-gray-800 text-xs">{c.user?.name || "Unknown"}</p>
                    {/* কমেন্টেও ব্রেক ওয়ার্ডস লজিক */}
                    <p className="text-gray-700 break-words whitespace-pre-wrap" style={{ overflowWrap: 'anywhere' }}>{c.text}</p>
                  </div>
                  <div className="text-[10px] text-gray-400 ml-2 mt-1 flex items-center gap-3">
                    <span>{moment(c.createdAt).fromNow()}</span>
                    {dbUser && (dbUser._id === c.user?._id || dbUser.role === 'admin' || dbUser.role === 'moderator') && (
                      <button onClick={() => handleDeleteComment(c._id)} className="text-red-400 hover:text-red-600 font-bold cursor-pointer hover:underline">Delete</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleComment} className="flex items-center gap-2 relative">
             {showEmojiPicker && <div className="absolute bottom-12 left-0 z-50 shadow-2xl"><EmojiPicker onEmojiClick={(e) => setCommentText(prev => prev + e.emoji)} height={300} width={280} searchDisabled={true}/></div>}
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-yellow-500 text-xl hover:scale-110 transition p-2 bg-white rounded-full border"><FaSmile /></button>
            <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a comment..." className="w-full border p-2 rounded-full px-4 outline-none focus:border-primary text-sm"/>
            <button type="submit" className="bg-primary text-white p-2 rounded-full"><FaPaperPlane /></button>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;