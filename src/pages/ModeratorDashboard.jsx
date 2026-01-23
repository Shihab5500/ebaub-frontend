

// import { useEffect, useState, useContext } from 'react';
// import { AuthContext } from '../providers/AuthProvider';
// import { FaTrash, FaUserCog, FaCheck, FaTimes, FaIdCard, FaEye, FaList, FaUserClock, FaExclamationCircle } from 'react-icons/fa';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';
// import moment from 'moment';

// const ModeratorDashboard = () => {
//   const { dbUser, logoutUser } = useContext(AuthContext);
//   const navigate = useNavigate();
  
//   const [users, setUsers] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [activeTab, setActiveTab] = useState('pending_posts');

//   const API_URL = 'http://localhost:5000';

//   const fetchData = () => {
//     fetch(`${API_URL}/api/users`)
//       .then(res => res.json())
//       .then(data => { if (Array.isArray(data)) setUsers(data); else setUsers([]); })
//       .catch(err => console.error("Users Error:", err));

//     fetch(`${API_URL}/api/posts/admin/all`)
//       .then(res => res.json())
//       .then(data => { if (Array.isArray(data)) setPosts(data); else setPosts([]); })
//       .catch(err => console.error("Posts Error:", err));
//   };

//   useEffect(() => { fetchData(); }, []);

//   const updateUserStatus = (id, status) => {
//     fetch(`${API_URL}/api/users/role`, {
//       method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) 
//     }).then(res => res.json()).then(() => { fetchData(); Swal.fire('Success', `User ${status}!`, 'success'); });
//   };

//   const updatePostStatus = (id, status) => {
//     fetch(`${API_URL}/api/posts/${id}/status`, {
//         method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
//     }).then(() => { fetchData(); Swal.fire('Success', `Post ${status}!`, 'success'); });
//   };

//   const deletePost = (id) => {
//     Swal.fire({
//         title: 'Delete Post?', text: "Cannot be undone!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete!'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             fetch(`${API_URL}/api/posts/${id}`, { method: 'DELETE' })
//             .then(() => { setPosts(posts.filter(p => p._id !== id)); Swal.fire('Deleted!', 'Post removed.', 'success'); });
//         }
//     });
//   };

//   if (dbUser?.role !== 'moderator' && dbUser?.role !== 'admin') return <div className="text-center mt-20 text-red-500 font-bold">Access Denied!</div>;

//   const pendingUsers = Array.isArray(users) ? users.filter(u => u.status === 'pending') : [];
//   const pendingPosts = Array.isArray(posts) ? posts.filter(p => p.status === 'pending') : [];

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 pt-10">
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
//         {/* Header */}
//         <div className="bg-purple-900 text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
//           <h1 className="text-3xl font-bold flex items-center gap-2"><FaUserCog /> Moderator Panel</h1>
//           <div className="flex gap-2 flex-wrap justify-center">
//             <button onClick={() => setActiveTab('pending_users')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${activeTab === 'pending_users' ? 'bg-orange-500 text-white' : 'bg-purple-700 hover:bg-purple-600'}`}>
//                <FaUserClock/> Req Users {pendingUsers.length > 0 && <span className="bg-white text-orange-600 px-2 rounded-full text-xs font-bold ml-1">{pendingUsers.length}</span>}
//             </button>
//             <button onClick={() => setActiveTab('pending_posts')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${activeTab === 'pending_posts' ? 'bg-blue-500 text-white' : 'bg-purple-700 hover:bg-purple-600'}`}>
//                <FaExclamationCircle/> Req Posts {pendingPosts.length > 0 && <span className="bg-white text-blue-600 px-2 rounded-full text-xs font-bold ml-1">{pendingPosts.length}</span>}
//             </button>
//             <button onClick={() => setActiveTab('all_posts')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${activeTab === 'all_posts' ? 'bg-white text-purple-900' : 'bg-purple-700 hover:bg-purple-600'}`}>
//                <FaList/> All Posts
//             </button>
//             <button onClick={() => { logoutUser(); navigate('/login'); }} className="bg-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-600 ml-2 shadow-lg">Logout</button>
//           </div>
//         </div>

//         <div className="p-6">
          
//           {/* TAB 1: PENDING USERS */}
//           {activeTab === 'pending_users' && (
//              <div className="space-y-4">
//                 <h2 className="text-xl font-bold text-orange-600 border-b pb-2">Pending User Requests</h2>
//                 {pendingUsers.length === 0 ? <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed"><p>No pending users.</p></div> : (
//                     pendingUsers.map(u => (
//                         <div key={u._id} className="border border-orange-200 bg-orange-50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center shadow-sm">
//                             <img src={u.photoURL} className="w-16 h-16 rounded-full border bg-white object-cover" />
//                             <div className="flex-1 text-center md:text-left">
//                                 <h3 className="font-bold text-lg">{u.name}</h3>
//                                 <p className="text-sm">ID: {u.varsityId} | Dept: {u.department}</p>
//                                 <p className="text-xs text-gray-500">{u.email}</p>
//                             </div>
//                             <div className="text-center">
//                                 <p className="text-xs font-bold mb-1"><FaIdCard/> Proof</p>
//                                 <img src={u.idCardImage || "https://via.placeholder.com/150"} className="w-24 h-16 object-cover rounded border cursor-pointer hover:scale-110 transition" onClick={() => window.open(u.idCardImage, '_blank')} onError={(e)=>{e.target.src="https://via.placeholder.com/150?text=Error"}}/>
//                             </div>
//                             <div className="flex flex-col gap-2 w-full md:w-auto">
//                                 <button onClick={() => updateUserStatus(u._id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 shadow font-bold w-full"><FaCheck/> Approve</button>
//                                 <button onClick={() => updateUserStatus(u._id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 shadow font-bold w-full"><FaTimes/> Reject</button>
//                             </div>
//                         </div>
//                     ))
//                 )}
//              </div>
//           )}

//           {/* TAB 2: PENDING POSTS (Mobile Fix Applied) */}
//           {activeTab === 'pending_posts' && (
//              <div className="space-y-6">
//                 <h2 className="text-xl font-bold text-blue-600 border-b pb-2">Pending Posts Approval</h2>
//                 {pendingPosts.length === 0 ? <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed"><p>No pending posts.</p></div> : (
//                     pendingPosts.map(p => (
//                         <div key={p._id} className="border border-blue-200 bg-blue-50 p-5 rounded-lg shadow-sm">
//                              <div className="flex items-center gap-3 mb-3 border-b border-blue-100 pb-3">
//                                 <img src={p.user?.photoURL} className="w-10 h-10 rounded-full border bg-white" />
//                                 <div>
//                                     <p className="font-bold text-gray-800">{p.user?.name}</p>
//                                     <span className="text-xs bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-600 font-medium">{p.category}</span>
//                                     <span className="text-xs text-gray-500 ml-2">{moment(p.createdAt).format('LLL')}</span>
//                                 </div>
//                              </div>

//                              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
//                                 <p className="text-gray-800 whitespace-pre-wrap text-base leading-relaxed">{p.content}</p>
//                                 {p.images?.length > 0 && (
//                                     <div className={`grid gap-2 mt-4 ${p.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
//                                         {p.images.map((img, i) => (
//                                             <div key={i} className="relative group overflow-hidden rounded-lg border cursor-pointer" onClick={() => window.open(img, '_blank')}>
//                                                 <img src={img} className="w-full h-40 object-cover hover:scale-105 transition duration-300"/>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                              </div>

//                              {/* 🔥 MOBILE FIX: Flex-col on mobile, Flex-row on desktop */}
//                              <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-blue-200 pt-3">
//                                 <button onClick={() => deletePost(p._id)} className="bg-gray-200 text-gray-700 px-4 py-3 rounded hover:bg-gray-300 flex items-center justify-center gap-2 font-bold w-full sm:w-auto"><FaTrash/> Delete</button>
//                                 <button onClick={() => updatePostStatus(p._id, 'rejected')} className="bg-red-500 text-white px-5 py-3 rounded hover:bg-red-600 flex items-center justify-center gap-2 font-bold shadow-md w-full sm:w-auto"><FaTimes/> Reject</button>
//                                 <button onClick={() => updatePostStatus(p._id, 'approved')} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 flex items-center justify-center gap-2 font-bold shadow-md w-full sm:w-auto"><FaCheck/> Approve & Publish</button>
//                              </div>
//                         </div>
//                     ))
//                 )}
//              </div>
//           )}

//           {/* 🔥 TAB 3: MANAGE ALL POSTS (FULL DETAILS VIEW ADDED) */}
//           {activeTab === 'all_posts' && (
//              <div className="space-y-4">
//                 <h2 className="text-xl font-bold text-purple-700 border-b pb-2 mb-4">Manage All Posts</h2>
//                 <div className="grid grid-cols-1 gap-6">
//                    {Array.isArray(posts) && posts.map(post => (
//                      <div key={post._id} className="border p-5 rounded-lg flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition">
//                        {/* Header */}
//                        <div className="flex items-center gap-3 mb-3 border-b pb-3">
//                             <img src={post.user?.photoURL} className="w-10 h-10 rounded-full border bg-gray-100" />
//                             <div>
//                                 <p className="font-bold text-gray-800 text-sm whitespace-pre-wrap">{post.user?.name}</p>
//                                 <div className="flex gap-2 mt-1">
//                                     <span className="text-[10px] bg-gray-100 border px-2 py-0.5 rounded text-gray-600">{post.category}</span>
//                                     <span className={`text-[10px] px-2 py-0.5 rounded text-white font-bold ${post.status==='approved'?'bg-green-500': post.status==='rejected'?'bg-red-500':'bg-orange-400'}`}>{post.status?.toUpperCase()}</span>
//                                 </div>
//                             </div>
//                        </div>
                       
//                        {/* Content - FULL VIEW */}
//                        <div className="bg-gray-50 p-3 rounded border">
//                            <p className="text-base text-gray-800 whitespace-pre-wrap">{post.content}</p>
//                            {/* Full Images Grid */}
//                            {post.images?.length > 0 && (
//                                 <div className={`grid gap-2 mt-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
//                                     {post.images.map((img, i) => (
//                                         <img key={i} src={img} className="w-full h-40 object-cover rounded border cursor-pointer hover:scale-105 transition" onClick={() => window.open(img, '_blank')}/>
//                                     ))}
//                                 </div>
//                            )}
//                        </div>

//                        <div className="flex justify-end pt-3 mt-2">
//                             <button onClick={() => deletePost(post._id)} className="text-red-500 hover:bg-red-50 p-2 rounded text-sm font-bold flex items-center gap-2 border border-red-200 w-full sm:w-auto justify-center"><FaTrash /> Delete Post</button>
//                        </div>
//                      </div>
//                    ))}
//                  </div>
//              </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModeratorDashboard;



import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { FaTrash, FaUserCog, FaCheck, FaTimes, FaIdCard, FaList, FaUserClock, FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const ModeratorDashboard = () => {
  const { dbUser, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending_posts');

  const API_URL = 'https://ebaub-backend.vercel.app';

  const fetchData = () => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setUsers(data); else setUsers([]); })
      .catch(err => console.error("Users Error:", err));

    fetch(`${API_URL}/api/posts/admin/all`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPosts(data); else setPosts([]); })
      .catch(err => console.error("Posts Error:", err));
  };

  useEffect(() => { fetchData(); }, []);

  const updateUserStatus = (id, status) => {
    fetch(`${API_URL}/api/users/role`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) 
    }).then(res => res.json()).then(() => { fetchData(); Swal.fire('Success', `User ${status}!`, 'success'); });
  };

  const updatePostStatus = (id, status) => {
    fetch(`${API_URL}/api/posts/${id}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
    }).then(() => { fetchData(); Swal.fire('Success', `Post ${status}!`, 'success'); });
  };

  const deletePost = (id) => {
    Swal.fire({
        title: 'Delete Post?', text: "", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete!',
        customClass: {
            confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-lg mx-2 hover:bg-red-700',
            cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded-lg mx-2 hover:bg-gray-600'
        },
        buttonsStyling: false


    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_URL}/api/posts/${id}`, { method: 'DELETE' })
            .then(() => { 
                setPosts(posts.filter(p => p._id !== id)); 
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Post removed.',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    customClass: {
                        confirmButton: 'bg-green-600 text-white px-4 py-2 rounded-lg'
                    },
                    buttonsStyling: false
                });
            });
        }
    });
  };

  if (dbUser?.role !== 'moderator' && dbUser?.role !== 'admin') return <div className="text-center mt-20 text-red-500 font-bold">Access Denied!</div>;

  const pendingUsers = Array.isArray(users) ? users.filter(u => u.status === 'pending') : [];
  const pendingPosts = Array.isArray(posts) ? posts.filter(p => p.status === 'pending') : [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-purple-900 text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2"><FaUserCog /> Moderator Panel</h1>
          <div className="flex gap-2 flex-wrap justify-center">
            <button onClick={() => setActiveTab('pending_users')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${activeTab === 'pending_users' ? 'bg-orange-500 text-white' : 'bg-purple-700 hover:bg-purple-600'}`}>
               <FaUserClock/> Req Users {pendingUsers.length > 0 && <span className="bg-white text-orange-600 px-2 rounded-full text-xs font-bold ml-1">{pendingUsers.length}</span>}
            </button>
            <button onClick={() => setActiveTab('pending_posts')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${activeTab === 'pending_posts' ? 'bg-blue-500 text-white' : 'bg-purple-700 hover:bg-purple-600'}`}>
               <FaExclamationCircle/> Req Posts {pendingPosts.length > 0 && <span className="bg-white text-blue-600 px-2 rounded-full text-xs font-bold ml-1">{pendingPosts.length}</span>}
            </button>
            <button onClick={() => setActiveTab('all_posts')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${activeTab === 'all_posts' ? 'bg-white text-purple-900' : 'bg-purple-700 hover:bg-purple-600'}`}>
               <FaList/> All Posts
            </button>
            <button onClick={() => { logoutUser(); navigate('/login'); }} className="bg-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-600 ml-2 shadow-lg">Logout</button>
          </div>
        </div>

        <div className="p-6">
          
          {/* TAB 1: PENDING USERS */}
          {activeTab === 'pending_users' && (
             <div className="space-y-4">
                <h2 className="text-xl font-bold text-orange-600 border-b pb-2">Pending User Requests</h2>
                {pendingUsers.length === 0 ? <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed"><p>No pending users.</p></div> : (
                    pendingUsers.map(u => (
                        <div key={u._id} className="border border-orange-200 bg-orange-50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center shadow-sm">
                            <img src={u.photoURL} className="w-16 h-16 rounded-full border bg-white object-cover" />
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-bold text-lg">{u.name}</h3>
                                <p className="text-sm">ID: {u.varsityId} | Dept: {u.department}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold mb-1"><FaIdCard/> Proof</p>
                                <img src={u.idCardImage || "https://via.placeholder.com/150"} className="w-24 h-16 object-cover rounded border cursor-pointer hover:scale-110 transition" onClick={() => window.open(u.idCardImage, '_blank')} onError={(e)=>{e.target.src="https://via.placeholder.com/150?text=Error"}}/>
                            </div>
                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                <button onClick={() => updateUserStatus(u._id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 shadow font-bold w-full"> Approve</button>
                                <button onClick={() => updateUserStatus(u._id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 shadow font-bold w-full"> Reject</button>
                            </div>
                        </div>
                    ))
                )}
             </div>
          )}

          {/* TAB 2: PENDING POSTS */}
          {activeTab === 'pending_posts' && (
             <div className="space-y-6">
                <h2 className="text-xl font-bold text-blue-600 border-b pb-2">Pending Posts Approval</h2>
                {pendingPosts.length === 0 ? <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed"><p>No pending posts.</p></div> : (
                    pendingPosts.map(p => (
                        <div key={p._id} className="border border-blue-200 bg-blue-50 p-5 rounded-lg shadow-sm">
                             <div className="flex items-center gap-3 mb-3 border-b border-blue-100 pb-3">
                                <img src={p.user?.photoURL} className="w-10 h-10 rounded-full border bg-white" />
                                <div>
                                    <p className="font-bold text-gray-800">{p.user?.name}</p>
                                    <span className="text-xs bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-600 font-medium">{p.category}</span>
                                    <span className="text-xs text-gray-500 ml-2">{moment(p.createdAt).format('LLL')}</span>
                                </div>
                             </div>

                             <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                                {/* FIXED HERE: Added break-words */}
                                <p className="text-gray-800 whitespace-pre-wrap break-words text-base leading-relaxed">{p.content}</p>
                                {p.images?.length > 0 && (
                                    <div className={`grid gap-2 mt-4 ${p.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
                                        {p.images.map((img, i) => (
                                            <div key={i} className="relative group overflow-hidden rounded-lg border cursor-pointer" onClick={() => window.open(img, '_blank')}>
                                                <img src={img} className="w-full h-40 object-cover hover:scale-105 transition duration-300"/>
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>

                             <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-blue-200 pt-3">
                                <button onClick={() => deletePost(p._id)} className="bg-gray-200 text-gray-700 px-4 py-3 rounded hover:bg-gray-300 flex items-center justify-center gap-2 font-bold w-full sm:w-auto"><FaTrash/> Delete</button>
                                <button onClick={() => updatePostStatus(p._id, 'rejected')} className="bg-red-500 text-white px-5 py-3 rounded hover:bg-red-600 flex items-center justify-center gap-2 font-bold shadow-md w-full sm:w-auto"><FaTimes/> Reject</button>
                                <button onClick={() => updatePostStatus(p._id, 'approved')} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 flex items-center justify-center gap-2 font-bold shadow-md w-full sm:w-auto"><FaCheck/> Approve & Publish</button>
                             </div>
                        </div>
                    ))
                )}
             </div>
          )}

          {/* TAB 3: MANAGE ALL POSTS */}
          {activeTab === 'all_posts' && (
             <div className="space-y-4">
                <h2 className="text-xl font-bold text-purple-700 border-b pb-2 mb-4">Manage All Posts</h2>
                <div className="grid grid-cols-1 gap-6">
                   {Array.isArray(posts) && posts.map(post => (
                     <div key={post._id} className="border p-5 rounded-lg flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition">
                       {/* Header */}
                       <div className="flex items-center gap-3 mb-3 border-b pb-3">
                            <img src={post.user?.photoURL} className="w-10 h-10 rounded-full border bg-gray-100" />
                            <div>
                                <p className="font-bold text-gray-800 text-sm whitespace-pre-wrap">{post.user?.name}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] bg-gray-100 border px-2 py-0.5 rounded text-gray-600">{post.category}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded text-white font-bold ${post.status==='approved'?'bg-green-500': post.status==='rejected'?'bg-red-500':'bg-orange-400'}`}>{post.status?.toUpperCase()}</span>
                                </div>
                            </div>
                       </div>
                       
                       {/* Content - FULL VIEW */}
                       <div className="bg-gray-50 p-3 rounded border">
                           {/* FIXED HERE: Added break-words */}
                           <p className="text-base text-gray-800 whitespace-pre-wrap break-words">{post.content}</p>
                           {post.images?.length > 0 && (
                                <div className={`grid gap-2 mt-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
                                    {post.images.map((img, i) => (
                                        <img key={i} src={img} className="w-full h-40 object-cover rounded border cursor-pointer hover:scale-105 transition" onClick={() => window.open(img, '_blank')}/>
                                    ))}
                                </div>
                           )}
                       </div>

                       <div className="flex justify-end pt-3 mt-2">
                            <button onClick={() => deletePost(post._id)} className="text-red-500 bg-red-50 p-2 rounded text-sm font-bold flex items-center gap-2 border border-red-200 w-full sm:w-auto justify-center"><FaTrash /> Delete Post</button>
                       </div>
                     </div>
                   ))}
                 </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;