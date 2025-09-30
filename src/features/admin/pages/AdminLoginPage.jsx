import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AdminLoginForm from '../components/AdminLoginForm';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/admin/dashboard');
  };

  return <AdminLoginForm onLogin={handleLogin} />;
};

export default AdminLoginPage;
