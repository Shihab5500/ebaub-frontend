


import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { FaTrash, FaUserShield, FaUserSlash, FaUserClock, FaBan } from 'react-icons/fa';
import moment from 'moment';

const AdminDashboard = () => {
  const { dbUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  // Fetch Data
  useEffect(() => {
    fetch('https://ebaub-backend.vercel.app/api/users').then(res => res.json()).then(data => setUsers(data));
    fetch('https://ebaub-backend.vercel.app/api/posts').then(res => res.json()).then(data => setPosts(data));
  }, []);

  // --- Actions ---

  // 1. Change Role
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

  // 2. Delete User
  const deleteUser = (id) => {
    if(!window.confirm("WARNING: This will delete the user and ALL their posts permanently! Are you sure?")) return;
    
    fetch(`https://ebaub-backend.vercel.app/api/users/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => {
      setUsers(users.filter(u => u._id !== id));
      alert("User Deleted Successfully!");
    });
  };

  // 3. Suspend User
  const suspendUser = (id) => {
    const days = prompt("কত দিনের জন্য সাসপেন্ড করতে চান? (সংখ্যা লিখুন, যেমন: 7)\nআনব্যান করতে 0 লিখুন।");
    if (days === null) return; // Cancel করলে

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

  // 4. Delete Post
  const deletePost = (id) => {
    if(!window.confirm("Delete this post?")) return;
    fetch(`https://ebaub-backend.vercel.app/api/posts/${id}`, { method: 'DELETE' })
    .then(() => setPosts(posts.filter(p => p._id !== id)));
  };

  // Check if suspended
  const isSuspended = (date) => {
    return date && new Date(date) > new Date();
  };

  if (dbUser?.role !== 'admin') return <div className="text-center mt-20 text-red-500 font-bold">Access Denied!</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-800 text-white p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2"><FaUserShield /> Admin Panel</h1>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'users' ? 'bg-primary' : 'bg-gray-600'}`}>Users</button>
            <button onClick={() => setActiveTab('posts')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'posts' ? 'bg-primary' : 'bg-gray-600'}`}>Posts</button>
          </div>
        </div>

        <div className="p-6">
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
                        {isSuspended(user.suspensionEndsAt) ? (
                          <div className="text-red-600 text-sm font-bold flex items-center gap-1">
                            <FaBan /> Suspended until {moment(user.suspensionEndsAt).format("MMM Do")}
                          </div>
                        ) : (
                          <span className="text-green-600 text-sm font-bold">Active</span>
                        )}
                      </td>

                      <td className="p-3 flex gap-1 flex-wrap">
                        {user.role !== 'admin' && <button onClick={() => changeRole(user._id, 'admin')} className="bg-black text-white px-2 py-1 rounded text-xs">Admin</button>}
                        {user.role !== 'moderator' && <button onClick={() => changeRole(user._id, 'moderator')} className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Mod</button>}
                        {user.role !== 'user' && <button onClick={() => changeRole(user._id, 'user')} className="bg-green-600 text-white px-2 py-1 rounded text-xs">User</button>}
                      </td>

                      <td className="p-3">
                         <div className="flex gap-2">
                           <button onClick={() => suspendUser(user._id)} className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600" title="Suspend User">
                             <FaUserClock />
                           </button>
                           <button onClick={() => deleteUser(user._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600" title="Delete Permanently">
                             <FaUserSlash />
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'posts' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {posts.map(post => (
                 <div key={post._id} className="border p-4 rounded flex justify-between">
                   <div>
                     <p className="font-bold">{post.user?.name}</p>
                     <p className="text-sm text-gray-600 line-clamp-1">{post.content}</p>
                   </div>
                   <button onClick={() => deletePost(post._id)} className="text-red-500"><FaTrash /></button>
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