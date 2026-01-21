


import { FaCode, FaGithub, FaLinkedin, FaEnvelope, FaGlobe } from "react-icons/fa";

const Developer = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen flex items-center justify-center">
      <div className="bg-white w-full rounded-3xl shadow-2xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 flex items-center justify-center">
          <FaCode className="text-white text-6xl opacity-20" />
        </div>

        {/* Content */}
        <div className="px-8 pb-8 text-center relative">
          
          {/* Profile Image (From Public Folder) */}
          <div className="w-32 h-32 mx-auto -mt-16 bg-white p-1 rounded-full shadow-lg">
            <img 
              src="/my-pic.jpg.jpeg"  // ⚠️ এখানে আপনার public ফোল্ডারের ছবির সঠিক নাম দিন (যেমন: shihab.png বা profile.jpg)
              alt="Shahariyar Sani Shihab" 
              className="w-full h-full rounded-full object-cover border-4 border-gray-100"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mt-4">Shahariyar Sani Shihab</h2>
          <p className="text-primary font-bold">Full Stack Software Engineer</p>
          <p className="text-gray-500 mt-2 text-sm">
            Passionate about building scalable web applications and solving real-world problems with code. 
            Currently studying B.Sc. in Agriculture at Exim Bank Agricultural University.
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-6">
            <a href="https://github.com/Shihab5500" target="_blank" className="p-3 bg-gray-100 rounded-full hover:bg-gray-800 hover:text-white transition">
              <FaGithub className="text-xl" />
            </a>
            <a href="https://www.linkedin.com/in/shahariyar-sani-shihab/" target="_blank" className="p-3 bg-gray-100 rounded-full hover:bg-blue-600 hover:text-white transition">
              <FaLinkedin className="text-xl" />
            </a>
            <a href="mailto:shihabahmed7600@gmail.com" className="p-3 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition">
              <FaEnvelope className="text-xl" />
            </a>
            <a href="https://shihab-dev-portfolio.netlify.app/" target="_blank" className="p-3 bg-gray-100 rounded-full hover:bg-green-500 hover:text-white transition">
              <FaGlobe className="text-xl" />
            </a>
          </div>

          {/* Tech Stack */}
          <div className="mt-8 border-t pt-6">
            <h3 className="font-bold text-gray-700 mb-3">Technologies Used</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Tailwind'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developer;