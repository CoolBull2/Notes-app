import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import React from 'react';
const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link to="/notes" className="text-xl font-bold text-blue-600">
              📝 Notes App
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/notes" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              My Notes
            </Link>
            <Link 
              to="/create-note" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Note
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;