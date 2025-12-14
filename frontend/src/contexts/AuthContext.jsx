import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

// Set axios default base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext({});

export { AuthContext };
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    // Try to get token from localStorage
    const storedToken = localStorage.getItem('token');
    const storedExpiry = localStorage.getItem('token_expiry');
    
    if (storedToken && storedExpiry) {
      const expiry = parseInt(storedExpiry, 10);
      if (Date.now() < expiry) {
        return storedToken;
      } else {
        // Token expired, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiry');
        localStorage.removeItem('refresh_token');
      }
    }
    return null;
  });
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  
  const navigate = useNavigate();
  const location = useLocation();

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Set token expiry (1 hour from now)
      const expiry = Date.now() + 60 * 60 * 1000;
      localStorage.setItem('token_expiry', expiry.toString());
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/auth/me');
          const userData = res.data.data?.user || res.data.user; // Handle both response structures
          setUser(userData);
          
          // Note: Don't redirect to verification here - only redirect after registration
          // Login should work for all users regardless of verification status
        } catch (error) {
          console.error('Failed to load user:', error);
          // Token is invalid, clear it
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const refreshAccessToken = async () => {
    try {
      const res = await axios.post('/api/auth/refresh', {
        refresh_token: refreshToken
      });
      
      const { token: newToken, refresh_token: newRefreshToken } = res.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('refresh_token', newRefreshToken);
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      
      toast.success('Session refreshed');
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
      return false;
    }
  };

  const login = async (phone, password, rememberMe = false) => {
    try {
      console.log('🔑 Attempting login with:', { phone });
      const res = await axios.post('/api/auth/login', { phone, password });
      console.log('✅ Login response:', res.data);
      
      const { token, user } = res.data.data; // Backend returns data nested in 'data'
      console.log('📦 Extracted token and user:', { token: token?.substring(0, 20) + '...', user });
      
      localStorage.setItem('token', token);
      
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }
      
      setToken(token);
      setUser(user);
      
      console.log('🎯 User role:', user.role);
      const redirectPath = localStorage.getItem('redirect_path') || getDefaultRoute(user.role);
      console.log('🚀 Navigating to:', redirectPath);
      
      // Show welcome back message
      toast.success(`Karibu ${user.name || 'back'}!`);
      
      // Redirect based on role
      navigate(redirectPath);
      localStorage.removeItem('redirect_path');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return {
        success: false,
        message
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      const { data } = res.data; // Backend returns data nested in 'data'
      
      // Registration doesn't return token - store phone for verification step
      localStorage.setItem('pending_verification_phone', userData.phone);
      
      toast.success('Registration successful! Please verify your phone.');
      
      // Always redirect to verification page after registration
      navigate('/verify-phone');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return {
        success: false,
        message
      };
    }
  };

  const verifyPhone = async (code) => {
    try {
      const phone = localStorage.getItem('pending_verification_phone');
      if (!phone) {
        throw new Error('No phone number found. Please register again.');
      }

      const res = await axios.post('/api/auth/verify-phone', { phone, code });
      const { token, user } = res.data.data; // Backend returns token and user in 'data'
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.removeItem('pending_verification_phone');
      setToken(token);
      setUser(user);
      
      toast.success('Phone verified successfully!');
      
      // Redirect to appropriate dashboard
      navigate(getDefaultRoute(user.role));
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Verification failed';
      toast.error(message);
      return {
        success: false,
        message
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('redirect_path');
    
    // Clear state
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    
    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Show logout message
    toast.success('Logged out successfully');
    
    // Redirect to home
    navigate('/');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      const updatedUser = res.data.user;
      
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return {
        success: false,
        message
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return {
        success: false,
        message
      };
    }
  };

  const getDefaultRoute = (role) => {
    switch(role) {
      case 'passenger':
        return '/passenger';
      case 'driver':
        return '/driver';
      case 'sacco_admin':
      case 'super_admin':
        return '/admin';
      default:
        return '/';
    }
  };

  const value = {
    user,
    loading,
    token,
    login,
    register,
    verifyPhone,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isPassenger: user?.role === 'passenger',
    isDriver: user?.role === 'driver',
    isAdmin: user?.role === 'sacco_admin',
    isPhoneVerified: user?.phoneVerified || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};