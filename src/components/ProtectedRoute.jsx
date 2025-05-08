import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordPopup from './PasswordPopup';

const ProtectedRoute = ({ children }) => {
  const [showPopup, setShowPopup] = useState(true);
  const navigate = useNavigate();

  const handleSuccess = () => {
    setShowPopup(false);
  };

  const handleClose = () => {
    navigate('/');
  };

  if (showPopup) {
    return <PasswordPopup onSuccess={handleSuccess} onClose={handleClose} />;
  }

  return children;
};

export default ProtectedRoute;