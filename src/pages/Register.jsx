

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; 
import { auth } from '../firebase.config';
import { AuthContext } from '../providers/AuthProvider'; 
import { motion } from 'framer-motion';
import Swal from 'sweetalert2'; // ✅ SweetAlert ইমপোর্ট করা হয়েছে

const Register = () => {
  const navigate = useNavigate();
  const { setDbUser } = useContext(AuthContext); 

  const [formData, setFormData] = useState({
    name: '', email: '', varsityId: '', department: '', batch: '', password: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const departments = [
    'BS in Agriculture', 'BS in Agricultural Economics', 'BBA', 
    'LL.B. (Hons.)', 'B.Sc. in Computer Science & Engineering'
  ];
  const batches = Array.from({ length: 40 }, (_, i) => `${i + 1} Batch`);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // File Size Check (Max 10MB)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { 
        // 🔥 সুন্দর অ্যালার্ট
        return Swal.fire({
          icon: 'error',
          title: 'ফাইল সাইজ অনেক বড়!',
          text: 'সর্বোচ্চ 10MB আপলোড করা যাবে।',
          confirmButtonColor: '#d33'
        });
      }
      setImage(file);
    }
  };

  const uploadImage = async () => {
    console.log("1. Image Upload Starting...");
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "ebaub_preset");
    data.append("cloud_name", "dhbcgeyjy");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dhbcgeyjy/image/upload", {
        method: "POST",
        body: data
      });
      const file = await res.json();
      console.log("2. Image Upload Done:", file.secure_url);
      return file.secure_url;
    } catch (error) {
      console.error("Cloudinary Error:", error);
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Registration Started...");
    setLoading(true);

    try {
      let photoURL = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
      if (image) {
        photoURL = await uploadImage();
      } else {
        console.log("Skipping Image Upload (No file selected)");
      }

      console.log("3. Creating Firebase User...");
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log("4. Firebase User Created:", user.uid);

      await updateProfile(user, {
        displayName: formData.name,
        photoURL: photoURL
      });

      const mongoUser = {
        name: formData.name,
        email: formData.email,
        varsityId: formData.varsityId,
        department: formData.department,
        batch: formData.batch,
        photoURL: photoURL,
        uid: user.uid,
        role: 'user'
      };

      console.log("5. Sending Data to MongoDB...", mongoUser);
      const res = await fetch('https://ebaub-backend.vercel.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mongoUser)
      });

      console.log("6. MongoDB Response Status:", res.status);
      const savedUser = await res.json();

      if (res.ok) {
        console.log("7. Success! Updating Context...");
        setDbUser(savedUser); 
        
        // 🔥 রেজিস্ট্রেশন সাকসেসফুল অ্যালার্ট
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful! 🎉',
          text: 'Welcome to EBAUB Fun Hub!',
          confirmButtonText: 'Let\'s Go!',
          confirmButtonColor: '#16a34a'
        }).then(() => {
          navigate('/'); 
        });

      } else {
        console.error("MongoDB Error:", savedUser);
        Swal.fire('Oops!', "Database Error: " + savedUser.message, 'error');
      }

    } catch (error) {
      console.error("🔥 ERROR CAUGHT:", error);
      
      // 🔥 এরর হ্যান্ডলিং অ্যালার্ট
      if (error.code === 'auth/email-already-in-use') {
        Swal.fire({
          icon: 'warning',
          title: 'Email Exists',
          text: 'এই ইমেইল টি আগেই ব্যবহার করা হয়েছে। অন্য ইমেইল দিন।',
          confirmButtonColor: '#d33'
        });
      } else if (error.message.includes('Failed to fetch')) {
        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: 'সার্ভার কানেকশন সমস্যা! (localhost:5000 চালু আছে কিনা দেখুন)',
          confirmButtonColor: '#d33'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.message,
          confirmButtonColor: '#d33'
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-primary outline-none" />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-primary outline-none" />
          
          <div className="flex gap-2">
            <input type="text" name="varsityId" placeholder="ID (Last 4)" maxLength="4" required onChange={handleChange} className="w-1/2 p-3 border rounded-lg focus:border-primary outline-none" />
            <select name="batch" required onChange={handleChange} className="w-1/2 p-3 border rounded-lg focus:border-primary outline-none bg-white">
              <option value="">Batch</option>
              {batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <select name="department" required onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-primary outline-none bg-white">
              <option value="">Select Department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <input type="password" name="password" placeholder="Password (Min 6 chars)" required onChange={handleChange} className="w-full p-3 border rounded-lg focus:border-primary outline-none" />
          
          <div className="border border-dashed p-2 rounded-lg hover:bg-gray-50 transition">
            <label className="text-sm text-gray-500 block mb-1">Profile Picture:</label>
            <input type="file" accept="image/*" required onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-green-700" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition transform active:scale-95">
            {loading ? "Processing... (Wait)" : "Register"}
          </button>
        </form>
        <p className="text-center mt-4">Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link></p>
      </motion.div>
    </div>
  );
};

export default Register;