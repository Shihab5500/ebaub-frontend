


// import { useEffect, useState, useContext } from 'react';
// import { AuthContext } from '../providers/AuthProvider';
// import { FaTrash, FaUserShield, FaUserSlash, FaUserClock, FaBan } from 'react-icons/fa';
// import moment from 'moment';

// const AdminDashboard = () => {
//   const { dbUser } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [activeTab, setActiveTab] = useState('users');

//   // Fetch Data
//   useEffect(() => {
//     fetch('https://ebaub-backend.vercel.app/api/users').then(res => res.json()).then(data => setUsers(data));
//     fetch('https://ebaub-backend.vercel.app/api/posts').then(res => res.json()).then(data => setPosts(data));
//   }, []);

//   // --- Actions ---

//   // 1. Change Role
//   const changeRole = (id, newRole) => {
//     if(!window.confirm(`Are you sure?`)) return;
//     fetch('https://ebaub-backend.vercel.app/api/users/role', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ id, role: newRole })
//     })
//     .then(res => res.json())
//     .then(updatedUser => {
//       setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
//     });
//   };

//   // 2. Delete User
//   const deleteUser = (id) => {
//     if(!window.confirm("WARNING: This will delete the user and ALL their posts permanently! Are you sure?")) return;
    
//     fetch(`https://ebaub-backend.vercel.app/api/users/${id}`, { method: 'DELETE' })
//     .then(res => res.json())
//     .then(() => {
//       setUsers(users.filter(u => u._id !== id));
//       alert("User Deleted Successfully!");
//     });
//   };

//   // 3. Suspend User
//   const suspendUser = (id) => {
//     const days = prompt("কত দিনের জন্য সাসপেন্ড করতে চান? (সংখ্যা লিখুন, যেমন: 7)\nআনব্যান করতে 0 লিখুন।");
//     if (days === null) return; // Cancel করলে

//     fetch('https://ebaub-backend.vercel.app/api/users/suspend', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ id, days })
//     })
//     .then(res => res.json())
//     .then(updatedUser => {
//       setUsers(users.map(u => u._id === id ? updatedUser : u));
//       if(days > 0) alert(`User suspended for ${days} days.`);
//       else alert("User Unbanned!");
//     });
//   };

//   // 4. Delete Post
//   const deletePost = (id) => {
//     if(!window.confirm("Delete this post?")) return;
//     fetch(`https://ebaub-backend.vercel.app/api/posts/${id}`, { method: 'DELETE' })
//     .then(() => setPosts(posts.filter(p => p._id !== id)));
//   };

//   // Check if suspended
//   const isSuspended = (date) => {
//     return date && new Date(date) > new Date();
//   };

//   if (dbUser?.role !== 'admin') return <div className="text-center mt-20 text-red-500 font-bold">Access Denied!</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 pt-10">
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
//         {/* Header */}
//         <div className="bg-gray-800 text-white p-6 flex justify-between items-center">
//           <h1 className="text-3xl font-bold flex items-center gap-2"><FaUserShield /> Admin Panel</h1>
//           <div className="flex gap-4">
//             <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'users' ? 'bg-primary' : 'bg-gray-600'}`}>Users</button>
//             <button onClick={() => setActiveTab('posts')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'posts' ? 'bg-primary' : 'bg-gray-600'}`}>Posts</button>
//           </div>
//         </div>

//         <div className="p-6">
//           {activeTab === 'users' && (
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-200 text-left">
//                     <th className="p-3">User Info</th>
//                     <th className="p-3">Status</th>
//                     <th className="p-3">Role Actions</th>
//                     <th className="p-3">Admin Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map(user => (
//                     <tr key={user._id} className={`border-b ${isSuspended(user.suspensionEndsAt) ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
//                       <td className="p-3">
//                         <p className="font-bold">{user.name}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                         <span className={`text-xs px-2 rounded ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100'}`}>{user.role}</span>
//                       </td>
                      
//                       <td className="p-3">
//                         {isSuspended(user.suspensionEndsAt) ? (
//                           <div className="text-red-600 text-sm font-bold flex items-center gap-1">
//                             <FaBan /> Suspended until {moment(user.suspensionEndsAt).format("MMM Do")}
//                           </div>
//                         ) : (
//                           <span className="text-green-600 text-sm font-bold">Active</span>
//                         )}
//                       </td>

//                       <td className="p-3 flex gap-1 flex-wrap">
//                         {user.role !== 'admin' && <button onClick={() => changeRole(user._id, 'admin')} className="bg-black text-white px-2 py-1 rounded text-xs">Admin</button>}
//                         {user.role !== 'moderator' && <button onClick={() => changeRole(user._id, 'moderator')} className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Mod</button>}
//                         {user.role !== 'user' && <button onClick={() => changeRole(user._id, 'user')} className="bg-green-600 text-white px-2 py-1 rounded text-xs">User</button>}
//                       </td>

//                       <td className="p-3">
//                          <div className="flex gap-2">
//                            <button onClick={() => suspendUser(user._id)} className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600" title="Suspend User">
//                              <FaUserClock />
//                            </button>
//                            <button onClick={() => deleteUser(user._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600" title="Delete Permanently">
//                              <FaUserSlash />
//                            </button>
//                          </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {activeTab === 'posts' && (
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                {posts.map(post => (
//                  <div key={post._id} className="border p-4 rounded flex justify-between">
//                    <div>
//                      <p className="font-bold">{post.user?.name}</p>
//                      <p className="text-sm text-gray-600 line-clamp-1">{post.content}</p>
//                    </div>
//                    <button onClick={() => deletePost(post._id)} className="text-red-500"><FaTrash /></button>
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
import { FaTrash, FaUserShield, FaUserSlash, FaUserClock, FaBan, FaCheck, FaTimes, FaIdCard } from 'react-icons/fa';
import moment from 'moment';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const { dbUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending_users'); // Default Tab changed

  // Fetch Data (Updated API Endpoint to get ALL posts including pending)
  const fetchData = () => {
    fetch('https://ebaub-backend.vercel.app/api/users').then(res => res.json()).then(data => setUsers(data));
    fetch('https://ebaub-backend.vercel.app/api/posts/admin/all').then(res => res.json()).then(data => setPosts(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Actions ---

  // 1. Approve/Reject User (NEW)
  const updateUserStatus = (id, status) => {
    fetch('https://ebaub-backend.vercel.app/api/users/role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }) 
    }).then(res => res.json()).then(() => {
      fetchData();
      Swal.fire('Success', `User ${status} successfully!`, 'success');
    });
  };

  // 2. Approve/Reject Post (NEW)
  const updatePostStatus = (id, status) => {
    fetch(`https://ebaub-backend.vercel.app/api/posts/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    }).then(() => {
        fetchData();
        Swal.fire('Success', `Post ${status} successfully!`, 'success');
    });
  };

  // 3. Change Role (EXISTING)
  const changeRole = (id, newRole) => {
    if(!window.confirm(`Are you sure?`)) return;
    fetch('https://ebaub-backend.vercel.app/api/users/role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole })
    })
    .then(res => res.json())
    .then(updatedUser => {
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    });
  };

  // 4. Delete User (EXISTING)
  const deleteUser = (id) => {
    if(!window.confirm("WARNING: This will delete the user and ALL their posts permanently! Are you sure?")) return;
    fetch(`https://ebaub-backend.vercel.app/api/users/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => {
      setUsers(users.filter(u => u._id !== id));
      alert("User Deleted Successfully!");
    });
  };

  // 5. Suspend User (EXISTING)
  const suspendUser = (id) => {
    const days = prompt("কত দিনের জন্য সাসপেন্ড করতে চান? (সংখ্যা লিখুন, যেমন: 7)\nআনব্যান করতে 0 লিখুন।");
    if (days === null) return; 

    fetch('https://ebaub-backend.vercel.app/api/users/suspend', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, days })
    })
    .then(res => res.json())
    .then(updatedUser => {
      setUsers(users.map(u => u._id === id ? updatedUser : u));
      if(days > 0) alert(`User suspended for ${days} days.`);
      else alert("User Unbanned!");
    });
  };

  // 6. Delete Post (EXISTING)
  const deletePost = (id) => {
    if(!window.confirm("Delete this post?")) return;
    fetch(`https://ebaub-backend.vercel.app/api/posts/${id}`, { method: 'DELETE' })
    .then(() => setPosts(posts.filter(p => p._id !== id)));
  };

  const isSuspended = (date) => date && new Date(date) > new Date();

  // Access Check (Allowed for Admin AND Moderator)
  if (dbUser?.role !== 'admin' && dbUser?.role !== 'moderator') return <div className="text-center mt-20 text-red-500 font-bold">Access Denied!</div>;

  const pendingUsers = users.filter(u => u.status === 'pending');
  const pendingPosts = posts.filter(p => p.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-800 text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2"><FaUserShield /> Admin Panel</h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setActiveTab('pending_users')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${activeTab === 'pending_users' ? 'bg-orange-500' : 'bg-gray-600'}`}>
               Req Users <span className="bg-white text-orange-600 px-2 rounded-full text-xs">{pendingUsers.length}</span>
            </button>
            <button onClick={() => setActiveTab('pending_posts')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${activeTab === 'pending_posts' ? 'bg-blue-500' : 'bg-gray-600'}`}>
               Req Posts <span className="bg-white text-blue-600 px-2 rounded-full text-xs">{pendingPosts.length}</span>
            </button>
            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'users' ? 'bg-primary' : 'bg-gray-600'}`}>All Users</button>
            <button onClick={() => setActiveTab('posts')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'posts' ? 'bg-primary' : 'bg-gray-600'}`}>All Posts</button>
          </div>
        </div>

        <div className="p-6">
          
          {/* --- TAB 1: PENDING USERS (With ID Card Check) --- */}
          {activeTab === 'pending_users' && (
             <div className="space-y-4">
                <h2 className="text-xl font-bold text-orange-600 border-b pb-2">Pending Registration Requests</h2>
                {pendingUsers.length === 0 ? <p className="text-gray-500">No pending requests.</p> : (
                    pendingUsers.map(u => (
                        <div key={u._id} className="border border-orange-200 bg-orange-50 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-start">
                            <img src={u.photoURL} className="w-16 h-16 rounded-full border bg-white" />
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{u.name}</h3>
                                <p className="text-sm">ID: <span className="font-bold">{u.varsityId}</span> | Batch: {u.batch}</p>
                                <p className="text-sm">Dept: {u.department}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                            
                            {/* ID CARD PREVIEW */}
                            <div className="text-center">
                                <p className="text-xs font-bold mb-1 flex items-center gap-1"><FaIdCard/> ID Card Proof</p>
                                <div className="relative group">
                                    <img 
                                      src={u.idCardImage || "https://via.placeholder.com/150?text=No+ID"} 
                                      className="w-32 h-20 object-cover rounded border cursor-pointer"
                                      onClick={() => window.open(u.idCardImage, '_blank')}
                                    />
                                    <span className="absolute bottom-0 left-0 bg-black/50 text-white text-[10px] w-full text-center">Click to Zoom</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button onClick={() => updateUserStatus(u._id, 'approved')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1 text-sm"><FaCheck/> Approve</button>
                                <button onClick={() => updateUserStatus(u._id, 'rejected')} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-1 text-sm"><FaTimes/> Reject</button>
                            </div>
                        </div>
                    ))
                )}
             </div>
          )}

          {/* --- TAB 2: PENDING POSTS --- */}
          {activeTab === 'pending_posts' && (
             <div className="space-y-4">
                <h2 className="text-xl font-bold text-blue-600 border-b pb-2">Pending Posts Approval</h2>
                {pendingPosts.length === 0 ? <p className="text-gray-500">No pending posts.</p> : (
                    pendingPosts.map(p => (
                        <div key={p._id} className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                             <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold">{p.user?.name} <span className="text-xs bg-gray-200 px-2 rounded ml-2">{p.category}</span></p>
                                    <p className="mt-2 text-gray-800 whitespace-pre-wrap">{p.content}</p>
                                    {p.images?.length > 0 && (
                                        <div className="flex gap-2 mt-2">
                                            {p.images.map((img, i) => <img key={i} src={img} className="w-16 h-16 object-cover rounded border"/>)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => updatePostStatus(p._id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"><FaCheck/> Approve</button>
                                    <button onClick={() => updatePostStatus(p._id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"><FaTimes/> Reject</button>
                                </div>
                             </div>
                        </div>
                    ))
                )}
             </div>
          )}

          {/* --- TAB 3: ALL USERS (Your Existing Code) --- */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">User Info</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Role Actions</th>
                    <th className="p-3">Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className={`border-b ${isSuspended(user.suspensionEndsAt) ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                      <td className="p-3">
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className={`text-xs px-2 rounded ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100'}`}>{user.role}</span>
                      </td>
                      <td className="p-3">
                         {/* Show Pending/Approved Status */}
                         <span className={`px-2 py-1 rounded text-xs text-white font-bold block w-fit mb-1 ${user.status === 'approved' ? 'bg-green-500' : user.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'}`}>
                            {user.status?.toUpperCase()}
                         </span>
                         {/* Show Suspended Status */}
                        {isSuspended(user.suspensionEndsAt) && (
                          <div className="text-red-600 text-xs font-bold flex items-center gap-1">
                            <FaBan /> Suspended
                          </div>
                        )}
                      </td>
                      <td className="p-3 flex gap-1 flex-wrap">
                        {user.role !== 'admin' && <button onClick={() => changeRole(user._id, 'admin')} className="bg-black text-white px-2 py-1 rounded text-xs">Admin</button>}
                        {user.role !== 'moderator' && <button onClick={() => changeRole(user._id, 'moderator')} className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Mod</button>}
                        {user.role !== 'user' && <button onClick={() => changeRole(user._id, 'user')} className="bg-green-600 text-white px-2 py-1 rounded text-xs">User</button>}
                      </td>
                      <td className="p-3">
                          <div className="flex gap-2">
                            <button onClick={() => suspendUser(user._id)} className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600" title="Suspend User"><FaUserClock /></button>
                            <button onClick={() => deleteUser(user._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600" title="Delete Permanently"><FaUserSlash /></button>
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- TAB 4: ALL POSTS (Your Existing Code) --- */}
          {activeTab === 'posts' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {posts.map(post => (
                 <div key={post._id} className="border p-4 rounded flex justify-between items-start bg-gray-50">
                   <div>
                     <p className="font-bold">{post.user?.name}</p>
                     <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                     <span className={`text-[10px] px-2 py-0.5 rounded text-white ${post.status==='approved'?'bg-green-500':'bg-orange-500'}`}>{post.status}</span>
                   </div>
                   <button onClick={() => deletePost(post._id)} className="text-red-500 p-2 hover:bg-red-100 rounded"><FaTrash /></button>
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