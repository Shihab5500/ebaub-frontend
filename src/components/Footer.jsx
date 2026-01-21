import { FaHeart, FaCode, FaGavel } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-10 py-8 text-center text-gray-600">
      
      {/* Links */}
      <div className="flex justify-center gap-6 mb-4 text-sm font-medium">
        <Link to="/rules" className="flex items-center gap-1 hover:text-primary transition">
          <FaGavel /> Rules
        </Link>
        <Link to="/developer" className="flex items-center gap-1 hover:text-primary transition">
          <FaCode /> Developer
        </Link>
      </div>

      <p className="flex items-center justify-center gap-1 text-sm">
        Made with <FaHeart className="text-red-500" /> by <span className="font-bold text-gray-800">Shahariyar Sani Shihab</span>
      </p>
      <p className="text-xs mt-1 text-gray-400">© {new Date().getFullYear()} EBAUB Fun Hub.</p>
    </footer>
  );
};

export default Footer;