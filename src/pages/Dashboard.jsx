


import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { FaEdit, FaSignOutAlt, FaCamera, FaSave, FaTimes, FaUserShield, FaTrash, FaUserClock, FaBan, FaList, FaUser, FaInfoCircle, FaArrowRight } from 'react-icons/fa';
import PostCard from '../components/PostCard';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

// ... (PostRow কম্পোনেন্ট যেমন ছিল তেমনই থাকবে) ...
// (PostRow কোড রিপিট করছি না জায়গা বাঁচানোর জন্য, আগেরটাই রাখুন)
const PostRow = ({ post, onDelete }) => {
  // ... PostRow logic here ...
  const [isExpanded, setIsExpanded] = useState(false);
  const textLimit = 100;
  const isLongText = post.content.length > textLimit;
  const displayContent = isExpanded ? post.content : post.content.slice(0, textLimit);

  return (
    <div className="border p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-4 bg-gray-50 hover:bg-gray-100 transition relative">
      <div className="flex items-start gap-3 w-full overflow-hidden">
        <img src={post.user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-12 h-12 rounded-full border shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-sm md:text-base">
            {post.user?.name} 
            <span className="ml-2 text-xs font-normal bg-gray-200 px-2 py-0.5 rounded text-gray-600 whitespace-nowrap">{post.category}</span>
             <span className={`ml-2 text-[10px] px-2 py-0.5 rounded text-white ${post.status === 'approved' ? 'bg-green-500' : post.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'}`}>
                {post.status?.toUpperCase()}
             </span>
          </h3>
          <p className="text-sm text-gray-600 mt-1 break-words whitespace-pre-wrap">
            {displayContent}
            {isLongText && !isExpanded && "..."}
            {isLongText && (
              <span onClick={() => setIsExpanded(!isExpanded)} className="text-blue-600 font-bold cursor-pointer ml-1 hover:underline select-none">
                {isExpanded ? " See Less" : " See More"}
              </span>
            )}
          </p>
          {post.images && post.images.length > 0 && (
             <div className="flex gap-1 mt-2">
                 {post.images.slice(0, 3).map((img, i) => (
                     <img key={i} src={img} className="w-10 h-10 rounded object-cover border" />
                 ))}
             </div>
          )}
        </div>
      </div>
      <button onClick={() => onDelete(post._id)} className="w-full md:w-auto bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition font-bold flex items-center justify-center gap-2 mt-2 md:mt-0 shrink-0">
        <FaTrash /> Delete
      </button>
    </div>
  );
};

const Dashboard = () => {
  const { dbUser, logoutUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile'); 
  const [myPosts, setMyPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const API_URL = 'https://ebaub-backend.vercel.app';

  useEffect(() => {
    if (dbUser?._id) {
      setEditName(dbUser.name);
      
      fetch(`${API_URL}/api/posts`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setAllPosts(data);
            const myOwn = data.filter(post => post.user?._id === dbUser._id);
            setMyPosts(myOwn);
          } else {
            setAllPosts([]);
            setMyPosts([]);
          }
        })
        .catch(err => console.error("Posts Fetch Error:", err));

      if (dbUser.role === 'admin' || dbUser.role === 'moderator') {
        fetch(`${API_URL}/api/users`)
          .then(res => res.json())
          .then(data => {
             if(Array.isArray(data)) setAllUsers(data);
          })
          .catch(err => console.error("Users Fetch Error:", err));
      }
    }
  }, [dbUser]);

  // Actions (Same as before)
  const deletePost = async (id) => {
    if(!window.confirm("Delete this post?")) return;
    fetch(`${API_URL}/api/posts/${id}`, { method: 'DELETE' })
      .then(() => {
        setAllPosts(allPosts.filter(p => p._id !== id));
        setMyPosts(myPosts.filter(p => p._id !== id));
        toast.success("Post Deleted");
      });
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    let photoURL = dbUser.photoURL;
    if (editImage) {
        const data = new FormData();
        data.append("file", editImage);
        data.append("upload_preset", "ebaub_preset");
        data.append("cloud_name", "dhbcgeyjy");
        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dhbcgeyjy/image/upload", { method: "POST", body: data });
            const file = await res.json();
            photoURL = file.secure_url;
        } catch (err) { console.error("Img Upload Failed"); }
    }

    try {
        await fetch(`${API_URL}/api/users/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: dbUser.email, name: editName, photoURL })
        });
        toast.success("Profile Updated! Reloading...");
        setTimeout(() => window.location.reload(), 1500);
    } catch (err) { toast.error("Failed to update"); }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Pending Warning */}
        {dbUser?.status === 'pending' && dbUser?.role !== 'admin' && (
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6 rounded shadow flex items-start gap-3">
                <FaInfoCircle className="text-xl mt-1"/>
                <div>
                    <p className="font-bold">Account Pending Approval</p>
                    <p className="text-sm">আপনার অ্যাকাউন্টটি বর্তমানে অ্যাডমিন রিভিউতে আছে।</p>
                </div>
            </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {dbUser?.role === 'admin' ? 'Admin Dashboard 🛡️' : dbUser?.role === 'moderator' ? 'Moderator Panel 👮' : 'My Dashboard 🎓'}
          </h1>
          <button onClick={() => { logoutUser(); navigate('/login'); }} className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
          <button onClick={() => setActiveTab('profile')} className={`px-5 py-2 rounded-t-lg font-bold flex items-center gap-2 ${activeTab === 'profile' ? 'bg-white text-primary border-t-2 border-primary' : 'bg-gray-200 text-gray-600'}`}>
            <FaUser /> My Profile
          </button>
          {(dbUser?.role === 'admin' || dbUser?.role === 'moderator') && (
            <button onClick={() => setActiveTab('all_posts')} className={`px-5 py-2 rounded-t-lg font-bold flex items-center gap-2 ${activeTab === 'all_posts' ? 'bg-white text-purple-600 border-t-2 border-purple-600' : 'bg-gray-200 text-gray-600'}`}>
              <FaList /> Manage All Posts
            </button>
          )}
          {dbUser?.role === 'admin' && (
            <button onClick={() => setActiveTab('users')} className={`px-5 py-2 rounded-t-lg font-bold flex items-center gap-2 ${activeTab === 'users' ? 'bg-white text-red-600 border-t-2 border-red-600' : 'bg-gray-200 text-gray-600'}`}>
              <FaUserShield /> Manage Users
            </button>
          )}
        </div>

        {/* TAB 1: PROFILE (Same as before) */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
             <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row items-center gap-6">
                 <div className="relative">
                   <img src={preview || dbUser?.photoURL} className="w-32 h-32 rounded-full border-4 border-primary object-cover" />
                   {isEditing && (
                     <label className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer">
                       <FaCamera />
                       <input type="file" className="hidden" onChange={(e) => { setEditImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} />
                     </label>
                   )}
                 </div>
                 <div className="flex-1 text-center md:text-left">
                   {isEditing ? (
                     <div className="space-y-3">
                       <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="border p-2 rounded w-full font-bold text-xl" />
                       <div className="flex gap-2 justify-center md:justify-start">
                         <button onClick={handleUpdateProfile} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"><FaSave /> Save</button>
                         <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded flex items-center gap-2"><FaTimes /> Cancel</button>
                       </div>
                     </div>
                   ) : (
                     <>
                       <h2 className="text-3xl font-bold">{dbUser?.name}</h2>
                       <p className="text-gray-500">{dbUser?.email}</p>
                       <div className="mt-2 flex gap-2">
                           <span className="text-sm bg-gray-100 px-2 py-1 rounded font-bold text-primary">{dbUser?.role?.toUpperCase()}</span>
                           <span className={`text-sm px-2 py-1 rounded font-bold text-white ${dbUser?.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'}`}>
                                {dbUser?.status?.toUpperCase()}
                           </span>
                       </div>
                       <button onClick={() => setIsEditing(true)} className="block mt-4 text-primary font-bold hover:underline mx-auto md:mx-0"><FaEdit className="inline mr-1"/> Edit Profile</button>
                     </>
                   )}
                 </div>
               </div>
             </div>

             <div className="max-w-3xl mx-auto">
               <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">My Recent Posts ({myPosts.length})</h3>
               {myPosts.length > 0 ? myPosts.map(post => (
                  <div key={post._id} className="relative group mb-6">
                     <div className="absolute top-4 right-4 z-10">
                         {post.status === 'pending' && <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow border-2 border-white">⏳ Pending</span>}
                         {post.status === 'approved' && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow border-2 border-white">✅ Live</span>}
                         {post.status === 'rejected' && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow border-2 border-white">❌ Rejected</span>}
                     </div>
                     <PostCard post={post} />
                  </div>
               )) : <p className="text-gray-500">No posts yet.</p>}
             </div>
          </div>
        )}

        {/* TAB 2: MANAGE ALL POSTS (Same as before) */}
        {activeTab === 'all_posts' && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-purple-700">All Posts Management ({allPosts.length})</h2>
            <div className="grid grid-cols-1 gap-4">
              {Array.isArray(allPosts) && allPosts.map(post => (
                <PostRow key={post._id} post={post} onDelete={deletePost} />
              ))}
            </div>
          </div>
        )}

        {/* 🔥 TAB 3: MANAGE USERS (NEW DESIGN) */}
        {activeTab === 'users' && (
             <div className="bg-white p-10 rounded-xl shadow-md text-center">
                 <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-8 rounded-2xl mb-6 shadow-2xl max-w-2xl mx-auto transform hover:scale-105 transition duration-300 cursor-pointer" onClick={()=>navigate('/admin-dashboard')}>
                    <FaUserShield className="text-6xl mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-2">Admin Action Center</h2>
                    <p className="text-lg opacity-90 mb-4">Manage User Approvals, Roles & Suspensions efficiently.</p>
                    <button className="bg-white text-red-600 px-6 py-2 rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-gray-100 transition shadow-lg">
                        Go to Admin Panel <FaArrowRight/>
                    </button>
                 </div>
                 <p className="text-gray-500 text-sm">You are viewing this because you have Admin privileges.</p>
             </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;