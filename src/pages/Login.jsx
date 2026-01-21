import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider'; // Context ইমপোর্ট
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const { loginUser } = useContext(AuthContext); // Context থেকে লগিন ফাংশন আনা
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await loginUser(email, password);
      // সফল হলে সোজা হোমে নিয়ে যাবে
      navigate('/'); 
    } catch (err) {
      setError("Email or Password doesn't match!");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center border rounded-lg p-3">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input name="email" type="email" placeholder="Email" required className="w-full outline-none" />
          </div>
          <div className="flex items-center border rounded-lg p-3">
            <FaLock className="text-gray-400 mr-2" />
            <input name="password" type="password" placeholder="Password" required className="w-full outline-none" />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
            Login
          </button>
        </form>
        <p className="text-center mt-4">New here? <Link to="/register" className="text-primary font-bold">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;