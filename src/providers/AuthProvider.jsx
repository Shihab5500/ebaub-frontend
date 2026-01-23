


// import { createContext, useEffect, useState } from "react";
// import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { auth } from "../firebase.config";

// export const AuthContext = createContext(null);

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [dbUser, setDbUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loginUser = (email, password) => {
//     setLoading(true);
//     return signInWithEmailAndPassword(auth, email, password);
//   };

//   const logoutUser = () => {
//     setLoading(true);
//     setDbUser(null);
//     return signOut(auth);
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
      
//       if (currentUser?.email) {
//         try {
//           const res = await fetch(`https://ebaub-backend.vercel.app/api/users/${currentUser.email}`);
//           if (res.ok) {
//             const data = await res.json();

//             // ⚠️ SUSPENSION CHECK ⚠️
//             // চেক করা হচ্ছে সাসপেনশন ডেট আছে কিনা এবং সেটা আজকের চেয়ে বড় কিনা
//             if (data.suspensionEndsAt && new Date(data.suspensionEndsAt) > new Date()) {
//               alert(`🚫 আপনার অ্যাকাউন্ট সাসপেন্ড করা হয়েছে! \nমেয়াদ শেষ হবে: ${new Date(data.suspensionEndsAt).toLocaleDateString()}`);
//               await signOut(auth); // জোর করে লগআউট
//               setUser(null);
//               setDbUser(null);
//             } else {
//               setDbUser(data); 
//             }

//           } else {
//             setDbUser(null);
//           }
//         } catch (error) {
//           console.error("Auth Error:", error);
//         }
//       } else {
//         setDbUser(null);
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const authInfo = { user, dbUser, setDbUser, loginUser, logoutUser, loading };

//   return (
//     <AuthContext.Provider value={authInfo}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;



import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase.config";
import Swal from 'sweetalert2';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logoutUser = () => {
    setLoading(true);
    setDbUser(null);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser?.email) {
        try {
          const res = await fetch(`https://ebaub-backend.vercel.app/api/users/${currentUser.email}`);
          if (res.ok) {
            const data = await res.json();

            // ⚠️ 1. SUSPENSION CHECK
            if (data.suspensionEndsAt && new Date(data.suspensionEndsAt) > new Date()) {
              await signOut(auth);
              Swal.fire('Account Suspended', `মেয়াদ শেষ হবে: ${new Date(data.suspensionEndsAt).toLocaleDateString()}`, 'error');
              setUser(null);
              setDbUser(null);
            } 
            // ⚠️ 2. PENDING/REJECTED CHECK (New Logic)
            else if (data.status === 'pending') {
                // আমরা ইউজারকে লগইন রাখবো কিন্তু শুধু Dashboard এ লিমিটেড এক্সেস দিবো, অথবা লগআউট করে দিবো।
                // বেস্ট প্র্যাকটিস: লগইন করতে দেওয়া, কিন্তু ডাটা সেট করে রাখা যাতে UI তে মেসেজ দেখানো যায়।
                setDbUser(data); 
            } 
            else if (data.status === 'rejected') {
                await signOut(auth);
                Swal.fire('Registration Rejected', 'আপনার রেজিস্ট্রেশন বাতিল করা হয়েছে। সঠিক আইডি কার্ড দিয়ে আবার চেষ্টা করুন।', 'error');
                setUser(null);
                setDbUser(null);
            }
            else {
              setDbUser(data); // Approved Users
            }

          } else {
            setDbUser(null);
          }
        } catch (error) {
          console.error("Auth Error:", error);
        }
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = { user, dbUser, setDbUser, loginUser, logoutUser, loading };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;