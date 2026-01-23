

// import { useState, useContext } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { AuthContext } from '../providers/AuthProvider';
// import { FaBars, FaTimes } from 'react-icons/fa';
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
//   const displayPhoto = dbUser?.photoURL || user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

//   // 🔥 ডাইনামিক ড্যাশবোর্ড লিংক (সবচেয়ে গুরুত্বপূর্ণ ফিক্স)
//   let dashboardLink = '/dashboard';
//   if (dbUser?.role === 'admin') dashboardLink = '/admin-dashboard';
//   if (dbUser?.role === 'moderator') dashboardLink = '/moderator-dashboard';

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
          
//           <Link to="/" className="flex items-center">
//             <img 
//               src="/main-logo.png" 
//               alt="EBAUB Fun Hub Logo" 
//               className="h-16 mt-3 w-auto object-contain hover:scale-105 transition duration-300" 
//             />
//             <span className="text-center pb-1 text-2xl font-extrabold text-primary tracking-tight group-hover:text-green-800 transition duration-300">
//             EBAUB FH
//             </span>
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

//             {/* Auth Section */}
//             <div className="ml-4">
//               {user ? (
//                 // 🔥 আপডেটেড লিংক
//                 <Link to={dashboardLink} title={`Go to ${dbUser?.role || 'User'} Dashboard`}>
//                   <img 
//                     src={displayPhoto} 
//                     alt="Profile" 
//                     className={`w-10 h-10 rounded-full border-2 hover:scale-110 transition object-cover ${
//                         dbUser?.role === 'admin' ? 'border-red-500' : 
//                         dbUser?.role === 'moderator' ? 'border-purple-500' : 'border-primary'
//                     }`}
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
//                 // 🔥 আপডেটেড লিংক
//                 <Link to={dashboardLink}>
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
import { FaBars, FaTimes } from 'react-icons/fa';
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
  const displayPhoto = dbUser?.photoURL || user?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  let dashboardLink = '/dashboard';
  if (dbUser?.role === 'admin') dashboardLink = '/admin-dashboard';
  if (dbUser?.role === 'moderator') dashboardLink = '/moderator-dashboard';

  return (
    // 🔥 গ্লাস ইফেক্ট এবং বর্ডার ফিক্স
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-green-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center"> {/* হাইট h-20 করা হয়েছে লোগোর জন্য */}

          {/* 🔥 BRAND LOGO SECTION UPDATED */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* আপনার ভার্সিটির লোগো ফাইলটি public ফোল্ডারে রাখুন */}
            <img
              src="/EABAUB logo.png" 
              alt="EBAUB Logo"
              className="h-12 w-auto object-contain group-hover:scale-105 transition duration-300"
              onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774889.png"} // লোগো না থাকলে ডিফল্ট আইকন
            />
            <div className="flex flex-col">
               {/* Varsity Style Text: EBAUB in Green, Fun Hub in Red */}
              <span className="text-2xl font-black text-[#006a4e] leading-none tracking-tight">
                EBAUB
              </span>
              <span className="text-[10px] sm:text-xs font-bold ml-0.5 text-red-600 tracking-[0.2em] uppercase">
                Fun Hub
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-semibold transition duration-300 text-sm relative group py-2 ${
                  isActive(link.path)
                    ? 'text-[#006a4e]'
                    : 'text-gray-600 hover:text-[#006a4e]'
                }`}
              >
                {link.name}
                {/* Animated Underline */}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#006a4e] transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}

            {/* Auth Section */}
            <div className="ml-4 pl-4 border-l border-gray-200">
              {user ? (
                <Link to={dashboardLink} title={`Go to ${dbUser?.role || 'User'} Dashboard`}>
                  <img
                    src={displayPhoto}
                    alt="Profile"
                    className={`w-10 h-10 rounded-full border-2 hover:shadow-lg transition object-cover ${
                        dbUser?.role === 'admin' ? 'border-red-500' :
                        dbUser?.role === 'moderator' ? 'border-purple-500' : 'border-[#006a4e]'
                    }`}
                  />
                </Link>
              ) : (
                <Link to="/login" className="bg-[#006a4e] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-800 transition shadow-lg hover:shadow-green-900/20 transform hover:-translate-y-0.5">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             {user && (
                <Link to={dashboardLink}>
                  <img
                    src={displayPhoto}
                    className="w-9 h-9 rounded-full border border-green-600 object-cover"
                  />
                </Link>
             )}

            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 text-2xl focus:outline-none p-2 rounded-md hover:bg-gray-100 transition">
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
            className="md:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition font-medium ${
                    isActive(link.path)
                      ? 'bg-green-50 text-[#006a4e] border-l-4 border-[#006a4e]'
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
                  className="block w-full text-center bg-[#006a4e] text-white py-3 rounded-xl font-bold mt-4 shadow-md"
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