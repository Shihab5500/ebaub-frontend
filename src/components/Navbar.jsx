

// import { useState, useContext } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { AuthContext } from '../providers/AuthProvider';
// import { FaBars, FaTimes, FaUniversity } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { user, dbUser } = useContext(AuthContext);
//   const location = useLocation();

//   const navLinks = [
//     { name: 'Home', path: '/' },
//     { name: 'Crush Confessions', path: '/crush' },
//     { name: 'Troll & Fun', path: '/troll' },
//     { name: 'Campus Sriti', path: '/campus-sriti' },
//     { name: 'Lost & Found', path: '/lost-found' },
//   ];

//   const isActive = (path) => location.pathname === path;

//   // ছবি লজিক: MongoDB > Firebase > Default
//   const displayPhoto = dbUser?.photoURL || user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
          
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl group">
//             <FaUniversity className="text-3xl group-hover:text-green-700 transition" />
//             <span>EBAUB FUN HUB<span className="text-gray-600 text-lg"></span></span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex space-x-6 items-center">
//             {navLinks.map((link) => (
//               <Link 
//                 key={link.name} 
//                 to={link.path} 
//                 className={`font-medium transition duration-300 text-sm lg:text-base ${
//                   isActive(link.path) 
//                     ? 'text-primary border-b-2 border-primary' 
//                     : 'text-gray-600 hover:text-primary'
//                 }`}
//               >
//                 {link.name}
//               </Link>
//             ))}

//             {/* --- ADMIN / MODERATOR LINKS (Desktop) --- */}
//             {dbUser?.role === 'admin' && (
//               <Link to="/admin-dashboard" className="text-red-600 font-bold hover:bg-red-50 px-3 py-1 rounded transition">
//                 Admin Panel
//               </Link>
//             )}
//             {dbUser?.role === 'moderator' && (
//               <Link to="/moderator-dashboard" className="text-purple-600 font-bold hover:bg-purple-50 px-3 py-1 rounded transition">
//                 Mod Panel
//               </Link>
//             )}

//             {/* Auth Section */}
//             <div className="ml-4">
//               {user ? (
//                 <Link to="/dashboard" title="Go to Dashboard">
//                   <img 
//                     src={displayPhoto} 
//                     alt="Profile" 
//                     className="w-10 h-10 rounded-full border-2 border-primary hover:scale-110 transition object-cover"
//                   />
//                 </Link>
//               ) : (
//                 <Link to="/login" className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition shadow-lg shadow-green-500/30">
//                   Login
//                 </Link>
//               )}
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center gap-4">
//              {user && (
//                 <Link to="/dashboard">
//                   <img 
//                     src={displayPhoto} 
//                     className="w-8 h-8 rounded-full border border-primary object-cover"
//                   />
//                 </Link>
//              )}

//             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 text-2xl focus:outline-none">
//               {isOpen ? <FaTimes /> : <FaBars />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Dropdown */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div 
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
//           >
//             <div className="flex flex-col p-4 space-y-2">
//               {navLinks.map((link) => (
//                 <Link 
//                   key={link.name} 
//                   to={link.path} 
//                   onClick={() => setIsOpen(false)}
//                   className={`block px-4 py-3 rounded-lg transition ${
//                     isActive(link.path) 
//                       ? 'bg-green-50 text-primary font-bold' 
//                       : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   {link.name}
//                 </Link>
//               ))}

//               {/* --- ADMIN / MODERATOR LINKS (Mobile) --- */}
//               {dbUser?.role === 'admin' && (
//                 <Link to="/admin-dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-red-600 font-bold bg-red-50">
//                   Admin Panel
//                 </Link>
//               )}
//               {dbUser?.role === 'moderator' && (
//                 <Link to="/moderator-dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-purple-600 font-bold bg-purple-50">
//                   Moderator Panel
//                 </Link>
//               )}
              
//               {!user && (
//                 <Link 
//                   to="/login" 
//                   onClick={() => setIsOpen(false)} 
//                   className="block w-full text-center bg-primary text-white py-3 rounded-lg font-bold mt-2"
//                 >
//                   Login Now
//                 </Link>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;


import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { FaBars, FaTimes, FaUniversity } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, dbUser } = useContext(AuthContext);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Crush Confessions', path: '/crush' },
    { name: 'Troll & Fun', path: '/troll' },
    { name: 'Campus Sriti', path: '/campus-sriti' },
    { name: 'Lost & Found', path: '/lost-found' },
  ];

  const isActive = (path) => location.pathname === path;

  // ছবি দেখানোর লজিক
  const displayPhoto = dbUser?.photoURL || user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl group">
            <FaUniversity className="text-3xl group-hover:text-green-700 transition" />
            <span>EBAUB FUN HUB<span className="text-gray-600 text-lg"></span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`font-medium transition duration-300 text-sm lg:text-base ${
                  isActive(link.path) 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Section (Only Profile Pic) */}
            <div className="ml-4">
              {user ? (
                <Link to="/dashboard" title="Go to Dashboard">
                  <img 
                    src={displayPhoto} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-primary hover:scale-110 transition object-cover"
                  />
                </Link>
              ) : (
                <Link to="/login" className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition shadow-lg shadow-green-500/30">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             {user && (
                <Link to="/dashboard">
                  <img 
                    src={displayPhoto} 
                    className="w-8 h-8 rounded-full border border-primary object-cover"
                  />
                </Link>
             )}

            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 text-2xl focus:outline-none">
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition ${
                    isActive(link.path) 
                      ? 'bg-green-50 text-primary font-bold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {!user && (
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="block w-full text-center bg-primary text-white py-3 rounded-lg font-bold mt-2"
                >
                  Login Now
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;