import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { FaTrash, FaUserCog, FaSearch } from 'react-icons/fa';

const ModeratorDashboard = () => {
  const { dbUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://ebaub-backend.vercel.app/api/posts').then(res => res.json()).then(data => setPosts(data));
  }, []);

  const deletePost = (id) => {
    if(!window.confirm("Are you sure you want to delete this post?")) return;

    fetch(`https://ebaub-backend.vercel.app/api/posts/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => {
      setPosts(posts.filter(p => p._id !== id));
      alert("Post Deleted Successfully!");
    });
  };

  // সিকিউরিটি চেক
  if (dbUser?.role !== 'moderator' && dbUser?.role !== 'admin') {
    return <div className="text-center mt-20 text-red-500 font-bold text-2xl">Access Denied! You are not a Moderator. ❌</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-purple-700 text-white p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2"><FaUserCog /> Moderator Panel</h1>
          <div className="bg-purple-800 px-4 py-2 rounded-lg flex items-center">
             <FaSearch className="mr-2 text-purple-200"/>
             <input 
               type="text" 
               placeholder="Search content..." 
               className="bg-transparent outline-none text-white placeholder-purple-300" 
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-700">All Posts ({posts.length})</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {posts
              .filter(p => p.content.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(post => (
              <div key={post._id} className="border rounded-lg p-4 flex gap-4 bg-gray-50 items-center">
                <img src={post.user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-12 h-12 rounded-full border" />
                
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{post.user?.name} <span className="text-xs font-normal text-gray-500">({post.category})</span></h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{post.content}</p>
                </div>

                <button onClick={() => deletePost(post._id)} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition font-bold flex items-center gap-2">
                  <FaTrash /> Delete
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModeratorDashboard;