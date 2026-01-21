

// import { createContext, useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
// import { auth } from "../firebase.config";

// export const AuthContext = createContext(null);

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [dbUser, setDbUser] = useState(null); // এই স্টেটটা আমরা আপডেট করবো
//   const [loading, setLoading] = useState(true);

//   const loginUser = (email, password) => {
//     setLoading(true);
//     return signInWithEmailAndPassword(auth, email, password);
//   };

//   const logoutUser = () => {
//     setLoading(true);
//     setDbUser(null); // লগআউট হলে ডাটা ক্লিয়ার
//     return signOut(auth);
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
      
//       if (currentUser?.email) {
//         try {
//           const res = await fetch(`http://localhost:5000/api/users/${currentUser.email}`);
//           if (res.ok) {
//             const data = await res.json();
//             setDbUser(data); 
//           } else {
//             setDbUser(null);
//           }
//         } catch (error) {
//           console.error("Auth Fetch Error:", error);
//         }
//       } else {
//         setDbUser(null);
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   // ⚠️ লক্ষ্য করো: এখানে setDbUser পাঠানো হচ্ছে
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
          const res = await fetch(`http://localhost:5000/api/users/${currentUser.email}`);
          if (res.ok) {
            const data = await res.json();

            // ⚠️ SUSPENSION CHECK ⚠️
            // চেক করা হচ্ছে সাসপেনশন ডেট আছে কিনা এবং সেটা আজকের চেয়ে বড় কিনা
            if (data.suspensionEndsAt && new Date(data.suspensionEndsAt) > new Date()) {
              alert(`🚫 আপনার অ্যাকাউন্ট সাসপেন্ড করা হয়েছে! \nমেয়াদ শেষ হবে: ${new Date(data.suspensionEndsAt).toLocaleDateString()}`);
              await signOut(auth); // জোর করে লগআউট
              setUser(null);
              setDbUser(null);
            } else {
              setDbUser(data); 
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