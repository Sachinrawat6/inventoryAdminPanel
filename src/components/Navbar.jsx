import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();

  // Function to check if token exists in cookies
  const checkToken = () => {
    const cookies = document.cookie.split(';');
    const tokenExists = cookies.some(cookie => 
      cookie.trim().startsWith('token=') && 
      cookie.split('=')[1].trim() !== ''
    );
    setHasToken(tokenExists);
  };

  // Check token on component mount and route changes
  useEffect(() => {
    checkToken();
    
    // Optional: Set up interval to check token periodically
    const interval = setInterval(checkToken, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/v1/users/logout', {}, {
        withCredentials: true
      });
      
      // Clear client-side state
      setHasToken(false);
      navigate('/login');
      
      // Force refresh to ensure all components get the updated state
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-white shadow-sm">
      <nav className="flex justify-between items-center px-4 py-3 container mx-auto">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Admin
        </Link>
        
        <ul className="flex items-center space-x-6">
          {hasToken ? (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;