

// import { useState, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; 
// import { auth } from '../firebase.config';
// import { AuthContext } from '../providers/AuthProvider'; 
// import { motion } from 'framer-motion';
// import Swal from 'sweetalert2'; // ✅ SweetAlert ইমপোর্ট করা হয়েছে

// const Register = () => {
//   const navigate = useNavigate();
//   const { setDbUser } = useContext(AuthContext); 

//   const [formData, setFormData] = useState({
//     name: '', email: '', varsityId: '', department: '', batch: '', password: ''
//   });
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const departments = [
//     'BS in Agriculture', 'BS in Agricultural Economics', 'BBA', 
//     'LL.B. (Hons.)', 'B.Sc. in Computer Science & Engineering'
//   ];
//   const batches = Array.from({ length: 40 }, (_, i) => `${i + 1} Batch`);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   // File Size Check (Max 10MB)
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) { 
//         // 🔥 সুন্দর অ্যালার্ট
//         return Swal.fire({
//           icon: 'error',
//           title: 'ফাইল সাইজ অনেক বড়!',
//           text: 'সর্বোচ্চ 10MB আপলোড করা যাবে।',
//           confirmButtonColor: '#d33'
//         });
//       }
//       setImage(file);
//     }
//   };

//   const uploadImage = async () => {
//     console.log("1. Image Upload Starting...");
//     const data = new FormData();
//     data.append("file", image);
//     data.append("upload_preset", "ebaub_preset");
//     data.append("cloud_name", "dhbcgeyjy");

//     try {
//       const res = await fetch("https://api.cloudinary.com/v1_1/dhbcgeyjy/image/upload", {
//         method: "POST",
//         body: data
//       });
//       const file = await res.json();
//       console.log("2. Image Upload Done:", file.secure_url);
//       return file.secure_url;
//     } catch (error) {
//       console.error("Cloudinary Error:", error);
//       return "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("🚀 Registration Started...");
//     setLoading(true);

//     try {
//       let photoURL = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
//       if (image) {
//         photoURL = await uploadImage();
//       } else {
//         console.log("Skipping Image Upload (No file selected)");
//       }

//       console.log("3. Creating Firebase User...");
//       const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
//       const user = userCredential.user;
//       console.log("4. Firebase User Created:", user.uid);

//       await updateProfile(user, {
//         displayName: formData.name,
//         photoURL: photoURL
//       });

//       const mongoUser = {
//         name: formData.name,
//         email: formData.email,
//         varsityId: formData.varsityId,
//         department: formData.department,
//         batch: formData.batch,
//         photoURL: photoURL,
//         uid: user.uid,
//         role: 'user'
//       };

//       console.log("5. Sending Data to MongoDB...", mongoUser);
//       const res = await fetch('https://ebaub-backend.vercel.app/api/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(mongoUser)
//       });

//       console.log("6. MongoDB Response Status:", res.status);
//       const savedUser = await res.json();

//       if (res.ok) {
//         console.log("7. Success! Updating Context...");
//         setDbUser(savedUser); 
        
//         // 🔥 রেজিস্ট্রেশন সাকসেসফুল অ্যালার্ট
//         Swal.fire({
//           icon: 'success',
//           title: 'Registration Successful! 🎉',
//           text: 'Welcome to EBAUB Fun Hub!',
//           confirmButtonText: 'Let\'s Go!',
//           confirmButtonColor: '#16a34a'
//         }).then(() => {
//           navigate('/'); 
//         });

//       } else {
//         console.error("MongoDB Error:", savedUser);
//         Swal.fire('Oops!', "Database Error: " + savedUser.message, 'error');
//       }

//     } catch (error) {
//       console.error("🔥 ERROR CAUGHT:", error);
      
//       // 🔥 এরর হ্যান্ডলিং অ্যালার্ট
//       if (error.code === 'auth/email-already-in-use') {
//         Swal.fire({
//           icon: 'warning',
//           title: 'Email Exists',
//           text: 'এই ইমেইল টি আগেই ব্যবহার করা হয়েছে। অন্য ইমেইল দিন।',
//           confirmButtonColor: '#d33'
//         });
//       } else if (error.message.includes('Failed to fetch')) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Server Error',
//           text: 'সার্ভার কানেকশন সমস্যা! (localhost:5000 চালু আছে কিনা দেখুন)',
//           confirmButtonColor: '#d33'
//         });
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Registration Failed',
//           text: error.message,
//           confirmButtonColor: '#d33'
//         });
//       }
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
//         <h2 className="text-3xl font-bold text-center text-primary mb-6">Create Account</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-primary outline-none" />
//           <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-primary outline-none" />
          
//           <div className="flex gap-2">
//             <input type="text" name="varsityId" placeholder="ID (Last 4)" maxLength="4" required onChange={handleChange} className="w-1/2 p-3 border rounded-lg focus:border-primary outline-none" />
//             <select name="batch" required onChange={handleChange} className="w-1/2 p-3 border rounded-lg focus:border-primary outline-none bg-white">
//               <option value="">Batch</option>
//               {batches.map(b => <option key={b} value={b}>{b}</option>)}
//             </select>
//           </div>

//           <select name="department" required onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-primary outline-none bg-white">
//               <option value="">Select Department</option>
//               {departments.map(d => <option key={d} value={d}>{d}</option>)}
//           </select>

//           <input type="password" name="password" placeholder="Password (Min 6 chars)" required onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-primary outline-none" />
          
//           <div className="border border-dashed p-2 rounded-lg hover:bg-gray-50 transition">
//             <label className="text-sm text-gray-500 block mb-1">Profile Picture:</label>
//             <input type="file" accept="image/*" required onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-green-700" />
//           </div>

//           <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition transform active:scale-95">
//             {loading ? "Processing... (Wait)" : "Register"}
//           </button>
//         </form>
//         <p className="text-center mt-4">Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link></p>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;


import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; 
import { auth } from '../firebase.config';
import { AuthContext } from '../providers/AuthProvider'; 
import { motion } from 'framer-motion';
import Swal from 'sweetalert2'; 
import { FaIdCard, FaUser, FaEnvelope, FaLock, FaUniversity } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { setDbUser } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    name: '', email: '', varsityId: '', department: '', batch: '', password: ''
  });
  
  // ✅ Two image states
  const [profileImage, setProfileImage] = useState(null);
  const [idCardImage, setIdCardImage] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const departments = [
    'BS in Agriculture', 'BS in Agricultural Economics', 'BBA', 
    'LL.B. (Hons.)', 'B.Sc. in Computer Science & Engineering'
  ];
  const batches = Array.from({ length: 40 }, (_, i) => `${i + 1} Batch`);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Generic File Handler
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { 
        return Swal.fire({ icon: 'error', title: 'ফাইল সাইজ অনেক বড়!', text: 'সর্বোচ্চ 10MB আপলোড করা যাবে।' });
      }
      if (type === 'profile') setProfileImage(file);
      if (type === 'idcard') setIdCardImage(file);
    }
  };

  // Upload to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ebaub_preset");
    data.append("cloud_name", "dhbcgeyjy");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dhbcgeyjy/image/upload", { method: "POST", body: data });
      const fileData = await res.json();
      return fileData.secure_url;
    } catch (error) {
      console.error("Upload Error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idCardImage) return Swal.fire('ID Card Required', 'ভেরিফিকেশনের জন্য ভার্সিটি আইডি কার্ডের ছবি দিতে হবে।', 'warning');

    setLoading(true);

    try {
      // 1. Upload Images
      let photoURL = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
      let idCardURL = "";

      if (profileImage) photoURL = await uploadImageToCloudinary(profileImage);
      
      // Upload ID Card
      idCardURL = await uploadImageToCloudinary(idCardImage);
      if (!idCardURL) throw new Error("ID Card Upload Failed");

      // 2. Create Firebase User
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.name, photoURL: photoURL });

      // 3. Prepare MongoDB Data
      const mongoUser = {
        name: formData.name,
        email: formData.email,
        varsityId: formData.varsityId,
        department: formData.department,
        batch: formData.batch,
        photoURL: photoURL,
        idCardImage: idCardURL, // ✅ Saving ID Card
        uid: user.uid,
        role: 'user',
        status: 'pending' // ✅ Default Pending
      };

      // 4. Save to MongoDB
      const res = await fetch('https://ebaub-backend.vercel.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mongoUser)
      });

      const savedUser = await res.json();

      if (res.ok) {
        setDbUser(savedUser); 
        Swal.fire({
          icon: 'success',
          title: 'Account Created! 🎉',
          html: 'আপনার অ্যাকাউন্টটি <b>Pending</b> অবস্থায় আছে।<br>অ্যাডমিন আপনার আইডি কার্ড চেক করে অ্যাপ্রুভ করলে আপনি সব ফিচার ব্যবহার করতে পারবেন।',
          confirmButtonText: 'OK',
          confirmButtonColor: '#16a34a'
        }).then(() => {
          navigate('/dashboard'); // Dashboard এ পাঠাবো যেখানে স্ট্যাটাস দেখাবে
        });
      } else {
        Swal.fire('Error', savedUser.message, 'error');
      }

    } catch (error) {
      console.error(error);
      Swal.fire('Registration Failed', error.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-primary mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">ভেরিফিকেশনের জন্য সঠিক তথ্য দিন</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-lg p-3 bg-gray-50">
             <FaUser className="text-gray-400 mr-2"/>
             <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="w-full bg-transparent outline-none" />
          </div>
          
          <div className="flex items-center border rounded-lg p-3 bg-gray-50">
             <FaEnvelope className="text-gray-400 mr-2"/>
             <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full bg-transparent outline-none" />
          </div>
          
          <div className="flex gap-2">
            <input type="text" name="varsityId" placeholder="ID (Last 4)" maxLength="4" required onChange={handleChange} className="w-1/2 p-3 border rounded-lg bg-gray-50 outline-none" />
            <select name="batch" required onChange={handleChange} className="w-1/2 p-3 border rounded-lg bg-gray-50 outline-none">
              <option value="">Batch</option>
              {batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <select name="department" required onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-50 outline-none">
              <option value="">Select Department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <div className="flex items-center border rounded-lg p-3 bg-gray-50">
             <FaLock className="text-gray-400 mr-2"/>
             <input type="password" name="password" placeholder="Password (Min 6 chars)" required onChange={handleChange} className="w-full bg-transparent outline-none" />
          </div>
          
          {/* Profile Pic */}
          <div className="border border-dashed p-3 rounded-lg hover:bg-green-50 transition bg-gray-50">
            <label className="text-sm text-gray-600 block mb-1 font-bold">Profile Picture (Required):</label>
            <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, 'profile')} className="w-full text-sm text-gray-500" />
          </div>

          {/* ID Card Upload - MANDATORY */}
          <div className="border-2 border-dashed border-red-200 p-3 rounded-lg hover:bg-red-50 transition bg-red-50/30">
            <label className="text-sm text-red-600 block mb-1 font-bold flex items-center gap-2">
                <FaIdCard/> Varsity ID Card Photo (Required):
            </label>
            <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, 'idcard')} className="w-full text-sm text-gray-500" />
            <p className="text-xs text-gray-400 mt-1">*Admin will verify this before approval.</p>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition shadow-lg">
            {loading ? "Processing..." : "Register & Request Approval"}
          </button>
        </form>
        <p className="text-center mt-4">Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link></p>
      </motion.div>
    </div>
  );
};

export default Register;
