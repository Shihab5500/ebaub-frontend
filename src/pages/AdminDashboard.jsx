

// import { useEffect, useState, useContext } from 'react';
// import { AuthContext } from '../providers/AuthProvider';
// import { FaTrash, FaUserShield, FaUserSlash, FaUserClock, FaBan, FaCheck, FaTimes, FaIdCard, FaEye, FaSignOutAlt } from 'react-icons/fa';
// import moment from 'moment';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';

// const AdminDashboard = () => {
//   const { dbUser, logoutUser } = useContext(AuthContext);
//   const navigate = useNavigate();
  
//   const [users, setUsers] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [activeTab, setActiveTab] = useState('pending_users');

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

//   // --- Actions ---
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

//   const changeRole = (id, newRole) => {
//     if(!window.confirm(`Change to ${newRole}?`)) return;
//     fetch(`${API_URL}/api/users/role`, {
//       method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role: newRole })
//     }).then(res => res.json()).then(() => {
//       setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
//     });
//   };

//   const deleteUser = (id) => {
//     if(!window.confirm("WARNING: Delete user?")) return;
//     fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' })
//     .then(res => res.json()).then(() => {
//       setUsers(users.filter(u => u._id !== id));
//       alert("Deleted!");
//     });
//   };

//   const suspendUser = (id) => {
//     const days = prompt("Suspend days (0 to Unban):");
//     if (days === null) return; 
//     fetch(`${API_URL}/api/users/suspend`, {
//       method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, days })
//     }).then(res => res.json()).then(updated => {
//       setUsers(users.map(u => u._id === id ? updated : u));
//     });
//   };

//   const deletePost = (id) => {
//     if(!window.confirm("Delete post?")) return;
//     fetch(`${API_URL}/api/posts/${id}`, { method: 'DELETE' })
//     .then(() => setPosts(posts.filter(p => p._id !== id)));
//   };

//   const isSuspended = (date) => date && new Date(date) > new Date();

//   if (dbUser?.role !== 'admin' && dbUser?.role !== 'moderator') return <div className="text-center mt-20 text-red-500 font-bold">Access Denied!</div>;

//   const pendingUsers = Array.isArray(users) ? users.filter(u => u.status === 'pending') : [];
//   const pendingPosts = Array.isArray(posts) ? posts.filter(p => p.status === 'pending') : [];

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 pt-10">
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
//         {/* Header */}
//         <div className="bg-gray-800 text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
//           <h1 className="text-3xl font-bold flex items-center gap-2"><FaUserShield /> Admin Panel</h1>
//           <div className="flex gap-2 flex-wrap justify-center">
//             <button onClick={() => setActiveTab('pending_users')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'pending_users' ? 'bg-orange-500' : 'bg-gray-700'}`}>Req Users ({pendingUsers.length})</button>
//             <button onClick={() => setActiveTab('pending_posts')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'pending_posts' ? 'bg-blue-500' : 'bg-gray-700'}`}>Req Posts ({pendingPosts.length})</button>
//             <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'users' ? 'bg-primary' : 'bg-gray-700'}`}>All Users</button>
//             <button onClick={() => setActiveTab('posts')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'posts' ? 'bg-primary' : 'bg-gray-700'}`}>All Posts</button>
//             <button onClick={() => { logoutUser(); navigate('/login'); }} className="bg-red-600 px-4 py-2 rounded-lg font-bold border border-red-500 flex items-center gap-2"><FaSignOutAlt/> Logout</button>
//           </div>
//         </div>

//         <div className="p-6">
          
//           {/* TAB 1: PENDING USERS */}
//           {activeTab === 'pending_users' && (
//              <div className="space-y-4">
//                 <h2 className="text-xl font-bold text-orange-600 border-b pb-2">Pending Requests</h2>
//                 {pendingUsers.length === 0 ? <p className="text-gray-500 py-4">No pending requests.</p> : (
//                     pendingUsers.map(u => (
//                         <div key={u._id} className="border border-orange-200 bg-orange-50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center shadow-sm">
//                             <img src={u.photoURL} className="w-16 h-16 rounded-full border bg-white object-cover" />
//                             <div className="flex-1 text-center md:text-left">
//                                 <h3 className="font-bold text-lg">{u.name}</h3>
//                                 <p className="text-sm">ID: {u.varsityId} | Dept: {u.department}</p>
//                                 <p className="text-xs text-gray-500">{u.email}</p>
//                             </div>
//                             <div className="text-center">
//                                 <img src={u.idCardImage} className="w-32 h-20 object-cover rounded border cursor-pointer hover:scale-125 transition" onClick={() => window.open(u.idCardImage, '_blank')}/>
//                             </div>
//                             <div className="flex flex-col gap-2 w-full md:w-auto">
//                                 <button onClick={() => updateUserStatus(u._id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold w-full">Approve</button>
//                                 <button onClick={() => updateUserStatus(u._id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold w-full">Reject</button>
//                             </div>
//                         </div>
//                     ))
//                 )}
//              </div>
//           )}

//           {/* TAB 2: PENDING POSTS */}
//           {activeTab === 'pending_posts' && (
//              <div className="space-y-6">
//                 <h2 className="text-xl font-bold text-blue-600 border-b pb-2">Pending Posts</h2>
//                 {pendingPosts.length === 0 ? <p className="text-gray-500 py-4">No pending posts.</p> : (
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
//                                     <div className="grid gap-2 mt-4 grid-cols-1 sm:grid-cols-3">
//                                         {p.images.map((img, i) => (
//                                             <img key={i} src={img} className="w-full h-40 object-cover rounded border cursor-pointer hover:scale-105 transition" onClick={() => window.open(img, '_blank')}/>
//                                         ))}
//                                     </div>
//                                 )}
//                              </div>
//                              <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-blue-200 pt-3">
//                                 <button onClick={() => deletePost(p._id)} className="bg-gray-200 text-gray-700 px-4 py-3 rounded font-bold w-full sm:w-auto">Delete</button>
//                                 <button onClick={() => updatePostStatus(p._id, 'rejected')} className="bg-red-500 text-white px-5 py-3 rounded font-bold w-full sm:w-auto">Reject</button>
//                                 <button onClick={() => updatePostStatus(p._id, 'approved')} className="bg-green-600 text-white px-6 py-3 rounded font-bold w-full sm:w-auto">Approve & Publish</button>
//                              </div>
//                         </div>
//                     ))
//                 )}
//              </div>
//           )}

//           {/* 🔥 TAB 3: ALL USERS (DATA FIXED) */}
//           {activeTab === 'users' && (
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse bg-white text-sm rounded-lg shadow-sm">
//                 <thead>
//                   <tr className="bg-gray-700 text-white text-left">
//                     <th className="p-3">User</th>
//                     <th className="p-3">Status</th>
//                     <th className="p-3">Role</th>
//                     <th className="p-3">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Array.isArray(users) && users.map(user => (
//                     <tr key={user._id} className="border-b hover:bg-gray-50">
//                       <td className="p-3">
//                         <p className="font-bold">{user.name}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </td>
//                       <td className="p-3">
//                          <span className={`px-2 py-1 rounded text-xs text-white font-bold ${user.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'}`}>{user.status?.toUpperCase()}</span>
//                       </td>
//                       <td className="p-3">
//                         <div className="flex gap-1 flex-wrap">
//                             {['user', 'moderator', 'admin'].map(r => (
//                                 <button key={r} onClick={() => changeRole(user._id, r)} 
//                                     className={`px-2 py-1 rounded text-xs capitalize border ${user.role === r ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
//                                 >{r}</button>
//                             ))}
//                         </div>
//                       </td>
//                       <td className="p-3 flex gap-2">
//                             <button onClick={() => suspendUser(user._id)} className="bg-orange-100 text-orange-600 p-2 rounded hover:bg-orange-200"><FaUserClock /></button>
//                             <button onClick={() => deleteUser(user._id)} className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"><FaTrash /></button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* 🔥 TAB 4: ALL POSTS (FULL DETAILS VIEW) */}
//           {activeTab === 'posts' && (
//              <div className="space-y-4">
//                 {Array.isArray(posts) && posts.map(post => (
//                  <div key={post._id} className="border p-5 rounded-lg bg-white shadow-sm flex flex-col justify-between">
//                    <div className="flex items-center gap-3 mb-3 border-b pb-3">
//                         <img src={post.user?.photoURL} className="w-10 h-10 rounded-full border bg-gray-100" />
//                         <div>
//                             <p className="font-bold text-gray-800 text-sm">{post.user?.name}</p>
//                             <div className="flex gap-2 mt-1">
//                                 <span className="text-[10px] bg-gray-100 border px-2 py-0.5 rounded text-gray-600">{post.category}</span>
//                                 <span className={`text-[10px] px-2 py-0.5 rounded text-white font-bold ${post.status==='approved'?'bg-green-500': post.status==='rejected'?'bg-red-500':'bg-orange-400'}`}>{post.status?.toUpperCase()}</span>
//                             </div>
//                         </div>
//                    </div>
                   
//                    <div className="bg-gray-50 p-3 rounded border">
//                        <p className="text-base text-gray-800 whitespace-pre-wrap">{post.content}</p>
//                        {post.images?.length > 0 && (
//                             <div className={`grid gap-2 mt-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
//                                 {post.images.map((img, i) => (
//                                     <img key={i} src={img} className="w-full h-40 object-cover rounded border cursor-pointer hover:scale-105 transition" onClick={() => window.open(img, '_blank')}/>
//                                 ))}
//                             </div>
//                        )}
//                    </div>

//                    <div className="flex justify-end pt-3 mt-2">
//                         <button onClick={() => deletePost(post._id)} className="text-red-500 hover:bg-red-50 p-2 rounded text-sm font-bold border border-red-200 flex items-center gap-2"><FaTrash /> Delete Post</button>
//                    </div>
//                  </div>
//                ))}
//              </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { FaTrash, FaUserShield, FaUserSlash, FaUserClock, FaBan, FaCheck, FaTimes, FaIdCard, FaEye, FaSignOutAlt } from 'react-icons/fa';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { dbUser, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending_users');

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

  // --- Actions ---
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

  // --- FIXED: CHANGE ROLE WITH SWEETALERT ---
  const changeRole = (id, newRole) => {
    Swal.fire({
        title: `Change Role to ${newRole}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, change!',
        customClass: {
            confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded-lg mx-2 hover:bg-blue-700',
            cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded-lg mx-2 hover:bg-gray-600'
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_URL}/api/users/role`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role: newRole })
            }).then(res => res.json()).then(() => {
                setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
                Swal.fire({ title: 'Updated!', icon: 'success', customClass: { confirmButton: 'bg-green-600 text-white px-4 py-2 rounded-lg' }, buttonsStyling: false });
            });
        }
    });
  };

// --- FIXED: DELETE USER WITH SWEETALERT ---
  const deleteUser = (id) => {
    Swal.fire({
        title: 'Delete User?',
        text: "This will remove the user permanently!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        customClass: {
            confirmButton: 'bg-red-600 text-white px-4 py-2 rounded-lg mx-2 hover:bg-red-700',
            cancelButton: 'bg-gray-500 text-white px-4 py-2 rounded-lg mx-2 hover:bg-gray-600'
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' })
            .then(res => res.json()).then(() => {
                setUsers(users.filter(u => u._id !== id));
                Swal.fire({ title: 'Deleted!', text: 'User has been removed.', icon: 'success', customClass: { confirmButton: 'bg-green-600 text-white px-4 py-2 rounded-lg' }, buttonsStyling: false });
            });
        }
    });
  };
// --- FIXED: SUSPEND USER WITH SWEETALERT ---
  const suspendUser = (id) => {
    Swal.fire({
        title: 'Suspend User',
        html: `<p class="text-gray-600 text-sm mb-2">Enter suspension duration in days <br/> (Type <strong>0</strong> to Unban)</p>`,
        input: 'number',
        inputPlaceholder: '',
        inputAttributes: {
            min: 0
        },
        showCancelButton: true,
        confirmButtonText: 'Suspend User',
        cancelButtonText: 'Cancel',
        customClass: {
            popup: 'rounded-2xl shadow-2xl p-6', // সুন্দর রাউন্ডেড কর্নার এবং শ্যাডো
            title: 'text-2xl font-bold text-gray-800 mb-2',
            input: 'w-3/4 mx-auto border-2 border-gray-300 rounded-lg p-3 text-center text-xl font-bold focus:border-orange-500 focus:ring-0 text-gray-700 shadow-inner bg-gray-50', // ইনপুট ফিল্ড ডিজাইন
            confirmButton: 'bg-orange-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-orange-600 transition shadow-md mx-2',
            cancelButton: 'bg-gray-400 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-gray-500 transition shadow-md mx-2',
            actions: 'mt-4 gap-3' // বাটনের মাঝখানে গ্যাপ
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.isConfirmed && result.value !== null) {
            const days = result.value;
            fetch(`${API_URL}/api/users/suspend`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, days })
            }).then(res => res.json()).then(updated => {
                setUsers(users.map(u => u._id === id ? updated : u));
                Swal.fire({ 
                    title: 'Updated!', 
                    text: days > 0 ? `User suspended for ${days} days.` : 'User has been Unbanned.',
                    icon: 'success', 
                    customClass: { confirmButton: 'bg-green-600 text-white px-6 py-2 rounded-lg' }, 
                    buttonsStyling: false 
                });
            });
        }
    });
  };

  // --- FIXED: DELETE POST WITH SWEETALERT (Request Fix) ---
  const deletePost = (id) => {
    Swal.fire({
        title: 'Delete Post?',
        text: "Cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        cancelButtonText: 'Cancel',
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
                    customClass: { confirmButton: 'bg-green-600 text-white px-4 py-2 rounded-lg' }, 
                    buttonsStyling: false 
                });
            });
        }
    });
  };

  const isSuspended = (date) => date && new Date(date) > new Date();

  if (dbUser?.role !== 'admin' && dbUser?.role !== 'moderator') return <div className="text-center mt-20 text-red-500 font-bold">Access Denied!</div>;

  const pendingUsers = Array.isArray(users) ? users.filter(u => u.status === 'pending') : [];
  const pendingPosts = Array.isArray(posts) ? posts.filter(p => p.status === 'pending') : [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-800 text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2"><FaUserShield /> Admin Panel</h1>
          <div className="flex gap-2 flex-wrap justify-center">
            <button onClick={() => setActiveTab('pending_users')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'pending_users' ? 'bg-orange-500' : 'bg-gray-700'}`}>Req Users ({pendingUsers.length})</button>
            <button onClick={() => setActiveTab('pending_posts')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'pending_posts' ? 'bg-blue-500' : 'bg-gray-700'}`}>Req Posts ({pendingPosts.length})</button>
            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'users' ? 'bg-primary' : 'bg-gray-700'}`}>All Users</button>
            <button onClick={() => setActiveTab('posts')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'posts' ? 'bg-primary' : 'bg-gray-700'}`}>All Posts</button>
            <button onClick={() => { logoutUser(); navigate('/login'); }} className="bg-red-600 px-4 py-2 rounded-lg font-bold border border-red-500 flex items-center gap-2"><FaSignOutAlt/> Logout</button>
          </div>
        </div>

        <div className="p-6">
          
          {/* TAB 1: PENDING USERS */}
          {activeTab === 'pending_users' && (
             <div className="space-y-4">
                <h2 className="text-xl font-bold text-orange-600 border-b pb-2">Pending Requests</h2>
                {pendingUsers.length === 0 ? <p className="text-gray-500 py-4">No pending requests.</p> : (
                    pendingUsers.map(u => (
                        <div key={u._id} className="border border-orange-200 bg-orange-50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center shadow-sm">
                            <img src={u.photoURL} className="w-16 h-16 rounded-full border bg-white object-cover" />
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="font-bold text-lg">{u.name}</h3>
                                <p className="text-sm">ID: {u.varsityId} | Dept: {u.department}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                            <div className="text-center">
                                <img src={u.idCardImage} className="w-32 h-20 object-cover rounded border cursor-pointer hover:scale-125 transition" onClick={() => window.open(u.idCardImage, '_blank')}/>
                            </div>
                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                <button onClick={() => updateUserStatus(u._id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold w-full">Approve</button>
                                <button onClick={() => updateUserStatus(u._id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold w-full">Reject</button>
                            </div>
                        </div>
                    ))
                )}
             </div>
          )}

          {/* TAB 2: PENDING POSTS */}
          {activeTab === 'pending_posts' && (
             <div className="space-y-6">
                <h2 className="text-xl font-bold text-blue-600 border-b pb-2">Pending Posts</h2>
                {pendingPosts.length === 0 ? <p className="text-gray-500 py-4">No pending posts.</p> : (
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
                                    <div className="grid gap-2 mt-4 grid-cols-1 sm:grid-cols-3">
                                        {p.images.map((img, i) => (
                                            <img key={i} src={img} className="w-full h-40 object-cover rounded border cursor-pointer hover:scale-105 transition" onClick={() => window.open(img, '_blank')}/>
                                        ))}
                                    </div>
                                )}
                             </div>
                             <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-blue-200 pt-3">
                                <button onClick={() => deletePost(p._id)} className="bg-gray-200 text-gray-700 px-4 py-3 rounded font-bold w-full sm:w-auto">Delete</button>
                                <button onClick={() => updatePostStatus(p._id, 'rejected')} className="bg-red-500 text-white px-5 py-3 rounded font-bold w-full sm:w-auto">Reject</button>
                                <button onClick={() => updatePostStatus(p._id, 'approved')} className="bg-green-600 text-white px-6 py-3 rounded font-bold w-full sm:w-auto">Approve & Publish</button>
                             </div>
                        </div>
                    ))
                )}
             </div>
          )}

          {/* TAB 3: ALL USERS */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white text-sm rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-700 text-white text-left">
                    <th className="p-3">User</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) && users.map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </td>
                      <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs text-white font-bold ${user.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'}`}>{user.status?.toUpperCase()}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                            {['user', 'moderator', 'admin'].map(r => (
                                <button key={r} onClick={() => changeRole(user._id, r)} 
                                    className={`px-2 py-1 rounded text-xs capitalize border ${user.role === r ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                >{r}</button>
                            ))}
                        </div>
                      </td>
                      <td className="p-3 flex gap-2">
                            <button onClick={() => suspendUser(user._id)} className="bg-orange-100 text-orange-600 p-2 rounded hover:bg-orange-200"><FaUserClock /></button>
                            <button onClick={() => deleteUser(user._id)} className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: ALL POSTS */}
          {activeTab === 'posts' && (
             <div className="space-y-4">
                {Array.isArray(posts) && posts.map(post => (
                 <div key={post._id} className="border p-5 rounded-lg bg-white shadow-sm flex flex-col justify-between">
                   <div className="flex items-center gap-3 mb-3 border-b pb-3">
                        <img src={post.user?.photoURL} className="w-10 h-10 rounded-full border bg-gray-100" />
                        <div>
                            <p className="font-bold text-gray-800 text-sm">{post.user?.name}</p>
                            <div className="flex gap-2 mt-1">
                                <span className="text-[10px] bg-gray-100 border px-2 py-0.5 rounded text-gray-600">{post.category}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded text-white font-bold ${post.status==='approved'?'bg-green-500': post.status==='rejected'?'bg-red-500':'bg-orange-400'}`}>{post.status?.toUpperCase()}</span>
                            </div>
                        </div>
                   </div>
                   
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
                        <button onClick={() => deletePost(post._id)} className="text-red-500 hover:bg-red-50 p-2 rounded text-sm font-bold border border-red-200 flex items-center gap-2"><FaTrash /> Delete Post</button>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;