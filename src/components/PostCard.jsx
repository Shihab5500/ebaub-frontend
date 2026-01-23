


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
//   // 🔥 API URL
//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
//   const [isExpanded, setIsExpanded] = useState(false); 

//   const timerRef = useRef(null);
//   const isLongPress = useRef(false);

//   // Data Safety
//   const safePost = currentPost || {};
//   const reactionsArray = Array.isArray(safePost.reactions) ? safePost.reactions : [];
//   const commentsArray = Array.isArray(safePost.comments) ? safePost.comments : [];
//   const { user, content, category, images, image, createdAt } = safePost;
  
//   const isAnonymous = category === 'Crush Confessions' || category === 'Troll & Fun';
//   const displayName = isAnonymous ? "Secret Admirer 🤫" : user?.name || "Unknown";
//   const displayPic = isAnonymous 
//     ? "https://cdn-icons-png.flaticon.com/512/4333/4333609.png" 
//     : user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  
//   const myReaction = reactionsArray.find(r => r.user === dbUser?._id);

//   // Text Logic
//   const textLimit = 150; 
//   const isLongText = content?.length > textLimit;
//   const displayContent = isExpanded ? content : content?.slice(0, textLimit);

//   // --- Handlers --- (Same logic)

//   const handleReact = async (type) => {
//     if (!dbUser) return toast.error("Please Login First!");
    
//     // 🔥 RESTRICTION LOGIC
//     if (dbUser.status !== 'approved') return toast.error("Account Pending Approval! Cannot React.");

//     setShowReactions(false);
//     try {
//       const res = await fetch(`${API_URL}/api/posts/${safePost._id}/react`, {
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
//       text: "You won't be able to revert this!",
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
//         const res = await fetch(`${API_URL}/api/posts/${safePost._id}/comments/${commentId}`, {
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
//         await fetch(`${API_URL}/api/posts/${safePost._id}`, { method: 'DELETE' });
//         setCurrentPost(null);
//         Swal.fire({
//             title: "Deleted!",
//             icon: "success",
//             customClass: { confirmButton: 'bg-green-600 text-white px-4 py-2 rounded-lg font-bold' },
//             buttonsStyling: false
//         });
//       } catch (err) { toast.error("Failed to delete"); }
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/posts/${safePost._id}`, {
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
    
//     // 🔥 RESTRICTION LOGIC
//     if (dbUser.status !== 'approved') return toast.error("Account Pending Approval! Cannot Comment.");

//     if (!commentText.trim()) return;
//     try {
//       const res = await fetch(`${API_URL}/api/posts/${safePost._id}/comment`, {
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

//   // 🔥 PROTECTION STYLES (রাইট ক্লিক ও সিলেকশন বন্ধ করার জন্য)
//   const protectionStyle = {
//     userSelect: 'none',
//     WebkitUserSelect: 'none',
//     WebkitTouchCallout: 'none', // iOS Long press বন্ধ করে
//     pointerEvents: 'none' // ক্লিক করা যাবে, কিন্তু ড্র্যাগ না
//   };

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
//             {/* 🔥 FIXED: Added 'whitespace-nowrap' to keep badge single line */}
//             <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold whitespace-nowrap ${category === 'Crush Confessions' ? 'bg-pink-500' : 'bg-green-500'}`}>
//               {category}
//             </span>
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
//         <div className="mb-4 text-gray-700 text-sm md:text-base">
//           <p className="whitespace-pre-wrap break-words" style={{ overflowWrap: 'anywhere' }}>
//             {displayContent}
//             {isLongText && !isExpanded && "..."}
//             {isLongText && (
//               <span onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 font-bold cursor-pointer ml-1 hover:underline select-none">
//                 {isExpanded ? " See Less" : " See More"}
//               </span>
//             )}
//           </p>
//         </div>
//       )}

//       {/* 🔥 IMAGE GALLERY (Protected & Full View) */}
//       {images && images.length > 0 ? (
//         <div className={`grid gap-1 mb-4 rounded-xl overflow-hidden border bg-black
//           ${images.length === 1 ? 'grid-cols-1' : ''}
//           ${images.length === 2 ? 'grid-cols-2' : ''}
//           ${images.length >= 3 ? 'grid-cols-2' : ''}
//         `}>
//           {images.map((imgUrl, index) => (
//             <div key={index} className={`relative overflow-hidden bg-black ${images.length >= 3 && index === 0 ? 'col-span-2 row-span-2' : 'h-64'}`}>
//               <img 
//                 src={imgUrl.replace('/upload/', '/upload/w_800,q_auto,f_auto/')} 
//                 alt={`Post-${index}`} 
                
//                 // ✅ UPDATED: object-contain for full image
//                 className="w-full h-full object-contain hover:scale-105 transition duration-500 cursor-pointer"
//                 loading="lazy"
                
//                 // ✅ PROTECTION
//                 onContextMenu={(e) => e.preventDefault()} 
//                 draggable="false"
//                 style={protectionStyle}

//                 // ✅ CLICK ACTION
//                 onClick={() => window.open(imgUrl, '_blank')}
//               />
//             </div>
//           ))}
//         </div>
//       ) : image && (
//         // Backward compatibility
//         <div className="w-full h-auto max-h-96 overflow-hidden rounded-xl mb-4 bg-black border">
//             <img 
//               src={image.replace('/upload/', '/upload/w_800,q_auto,f_auto/')} 
//               alt="Post" 
//               className="w-full h-full object-contain" 
//               loading="lazy"
              
//               // ✅ PROTECTION
//               onContextMenu={(e) => e.preventDefault()} 
//               draggable="false"
//               style={protectionStyle}

//               // ✅ CLICK ACTION
//               onClick={() => window.open(image, '_blank')}
//             />
//         </div>
//       )}

//       {/* Actions */}
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

//       {/* Comments */}
//       {showCommentBox && (
//         <div className="mt-4 pt-4 border-t bg-gray-50 p-3 rounded-lg relative">
//           <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
//             {commentsArray.length === 0 && <p className="text-center text-gray-400 text-sm">No comments yet. Be the first!</p>}
            
//             {commentsArray.map((c, i) => (
//               <div key={i} className="flex gap-2 items-start group">
//                 <img src={c.user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full border bg-white" />
//                 <div className="flex-1 min-w-0"> 
//                   <div className="bg-white p-2 rounded-2xl text-sm shadow-sm border inline-block pr-4 relative max-w-full">
//                     <p className="font-bold text-gray-800 text-xs">{c.user?.name || "Unknown"}</p>
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
  const API_URL = import.meta.env.VITE_API_URL || 'https://ebaub-backend.vercel.app';

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
  const [isExpanded, setIsExpanded] = useState(false); 

  const timerRef = useRef(null);
  const isLongPress = useRef(false);

  // Data Safety
  const safePost = currentPost || {};
  const reactionsArray = Array.isArray(safePost.reactions) ? safePost.reactions : [];
  const commentsArray = Array.isArray(safePost.comments) ? safePost.comments : [];
  const { user, content, category, images, image, createdAt } = safePost;
  
  const isAnonymous = category === 'Crush Confessions' || category === 'Troll & Fun';
  const displayName = isAnonymous ? "Secret Admirer 🤫" : user?.name || "Unknown";
  const displayPic = isAnonymous 
    ? "https://cdn-icons-png.flaticon.com/512/4333/4333609.png" 
    : user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  
  const myReaction = reactionsArray.find(r => r.user === dbUser?._id);

  const textLimit = 150; 
  const isLongText = content?.length > textLimit;
  const displayContent = isExpanded ? content : content?.slice(0, textLimit);

  // 🔥 Helper for formatting counts
  const formatCount = (num) => {
    if (!num) return 0;
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(num);
  };

  // --- Handlers ---
  const handleReact = async (type) => {
    if (!dbUser) return toast.error("Please Login First!");
    if (dbUser.status !== 'approved') return toast.error("Account Pending Approval!");

    setShowReactions(false);
    try {
      const res = await fetch(`${API_URL}/api/posts/${safePost._id}/react`, {
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

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: 'Delete this comment?',
      text: "Cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      customClass: { confirmButton: 'bg-red-600 text-white px-4 py-2 rounded mx-2', cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded mx-2' },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/posts/${safePost._id}/comments/${commentId}`, {
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

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete Post?',
      text: "Cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      customClass: { confirmButton: 'bg-red-600 text-white px-4 py-2 rounded mx-2', cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded mx-2' },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/api/posts/${safePost._id}`, { method: 'DELETE' });
        setCurrentPost(null);
        Swal.fire({ title: "Deleted!", icon: "success", customClass: { confirmButton: 'bg-green-600 text-white px-4 py-2 rounded' }, buttonsStyling: false });
      } catch (err) { toast.error("Failed to delete"); }
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts/${safePost._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentPost(updated);
        setIsEditing(false);
        toast.success("Updated");
      }
    } catch (err) { toast.error("Failed to update"); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!dbUser) return toast.error("Login First!");
    if (dbUser.status !== 'approved') return toast.error("Account Pending Approval!");
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/posts/${safePost._id}/comment`, {
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
  const protectionStyle = { userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none', pointerEvents: 'none' };

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
            <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold whitespace-nowrap ${category === 'Crush Confessions' ? 'bg-pink-500' : 'bg-green-500'}`}>
              {category}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
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
          <p className="whitespace-pre-wrap break-words" style={{ overflowWrap: 'anywhere' }}>
            {displayContent}
            {isLongText && !isExpanded && "..."}
            {isLongText && (
              <span onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 font-bold cursor-pointer ml-1 hover:underline select-none">
                {isExpanded ? " See Less" : " See More"}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Images */}
      {images && images.length > 0 ? (
        <div className={`grid gap-1 mb-4 rounded-xl overflow-hidden border bg-black ${images.length === 1 ? 'grid-cols-1' : ''} ${images.length === 2 ? 'grid-cols-2' : ''} ${images.length >= 3 ? 'grid-cols-2' : ''} `}>
          {images.map((imgUrl, index) => (
            <div key={index} className={`relative overflow-hidden bg-black ${images.length >= 3 && index === 0 ? 'col-span-2 row-span-2' : 'h-64'}`}>
              <img src={imgUrl.replace('/upload/', '/upload/w_800,q_auto,f_auto/')} alt={`Post-${index}`} className="w-full h-full object-contain hover:scale-105 transition duration-500 cursor-pointer" loading="lazy" onContextMenu={(e) => e.preventDefault()} draggable="false" style={protectionStyle} onClick={() => window.open(imgUrl, '_blank')} />
            </div>
          ))}
        </div>
      ) : image && (
        <div className="w-full h-auto max-h-96 overflow-hidden rounded-xl mb-4 bg-black border">
            <img src={image.replace('/upload/', '/upload/w_800,q_auto,f_auto/')} alt="Post" className="w-full h-full object-contain" loading="lazy" onContextMenu={(e) => e.preventDefault()} draggable="false" style={protectionStyle} onClick={() => window.open(image, '_blank')} />
        </div>
      )}

      {/* 🔥 FIXED ACTIONS LAYOUT 
          - Mobile: Flex Row (এক লাইনে)
          - Desktop (lg): Grid (উপরে ২টা, নিচে ১টা) 
      */}
      <div className="
        border-t pt-3 text-gray-600 relative select-none w-full
        flex justify-between items-center                /* Mobile Style: Flex row */
        lg:grid lg:grid-cols-2 lg:gap-3 lg:items-center  /* Desktop Style: Grid 2 columns */
      ">
        
        {/* Like Button (Desktop: Col 1) */}
        <div className="relative flex items-center lg:justify-start" onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
          <AnimatePresence>
            {showReactions && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: -50, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }} className="absolute left-0 bottom-full mb-2 bg-white shadow-2xl rounded-full px-3 py-2 flex gap-3 border z-20">
                {Object.keys(reactionsMap).map((key) => (
                  <button key={key} onClick={() => handleReact(key)} className="text-2xl hover:scale-125 transition duration-200 transform">{reactionsMap[key]}</button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          <button onTouchStart={handlePressStart} onTouchEnd={handlePressEnd} onMouseDown={handlePressStart} onMouseUp={handlePressEnd} onClick={handleMainButtonAction} className={`flex items-center gap-1 sm:gap-2 transition px-2 py-1 rounded-lg hover:bg-gray-100 active:bg-gray-200 ${myReaction ? 'text-blue-600 font-bold' : ''}`}>
            <span className="text-xl">{myReaction ? reactionsMap[myReaction.type] : '👍'}</span>
            <span className="text-sm font-medium whitespace-nowrap">
                {myReaction ? myReaction.type.charAt(0).toUpperCase() + myReaction.type.slice(1) : 'Like'} 
                {reactionsArray.length > 0 && ` (${formatCount(reactionsArray.length)})`}
            </span>
          </button>
        </div>
        
        {/* Comment Button (Desktop: Col 2 - Aligned End) */}
        <div className="flex items-center lg:justify-end">
            <button onClick={() => setShowCommentBox(!showCommentBox)} className="flex items-center gap-1 sm:gap-2 hover:text-blue-500 transition px-2 py-1 rounded-lg hover:bg-gray-100">
            <FaComment /> 
            <span className="text-sm font-medium whitespace-nowrap">
                Comment {commentsArray.length > 0 && `(${formatCount(commentsArray.length)})`}
            </span>
            </button>
        </div>

        {/* Share Button (Desktop: Col Span 2 - Bottom Full Width) */}
        <div className="flex items-center lg:col-span-2 lg:justify-center lg:w-full lg:bg-gray-50 lg:rounded-lg lg:mt-1">
            <button onClick={handleShare} className="flex items-center justify-center gap-1 sm:gap-2 hover:text-gray-800 transition px-2 py-1 rounded-lg hover:bg-gray-100 w-full">
            <FaShare /> <span className="text-sm font-medium">Share</span>
            </button>
        </div>
      </div>

      {/* Comments Box */}
      {showCommentBox && (
        <div className="mt-4 pt-4 border-t bg-gray-50 p-3 rounded-lg relative">
          <div className="max-h-60 overflow-y-auto mb-4 space-y-3">
            {commentsArray.length === 0 && <p className="text-center text-gray-400 text-sm">No comments yet.</p>}
            
            {commentsArray.map((c, i) => (
              <div key={i} className="flex gap-2 items-start group">
                <img src={c.user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full border bg-white" />
                <div className="flex-1 min-w-0"> 
                  <div className="bg-white p-2 rounded-2xl text-sm shadow-sm border inline-block pr-4 relative max-w-full">
                    <p className="font-bold text-gray-800 text-xs">{c.user?.name || "Unknown"}</p>
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