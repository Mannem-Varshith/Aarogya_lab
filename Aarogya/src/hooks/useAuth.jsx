import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from '../lib/api';
import { jwtDecode } from 'jwt-decode';

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {'patient' | 'doctor' | 'lab'} role
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User | null} user
 * @property {string | null} token
 * @property {boolean} loading
 * @property {(email: string, password: string) => Promise<{ success: boolean, error?: string }>} login
 * @property {(data: any) => Promise<{ success: boolean, error?: string }>} register
 * @property {() => void} logout
 * @property {boolean} isAuthenticated
 */

// Create Auth Context
/** @type {React.Context<AuthContextType>} */
const AuthContext = createContext();

// Auth Provider Component
function AuthProvider({ children }) {
  console.log('AuthProvider initialized');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking auth with token:', token ? 'exists' : 'null');
      if (token) {
        try {
          // Decode JWT token to get user info
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          console.log('Token decoded:', decoded);
          console.log('Token expires at:', new Date(decoded.exp * 1000));
          console.log('Current time:', new Date(currentTime * 1000));
          
          if (decoded.exp > currentTime) {
            console.log('Token is valid, fetching user profile...');
            // Get fresh user data from API
            const response = await authAPI.getProfile();
            console.log('Profile response:', response);
            if (response.status === 'success') {
              console.log('Setting user from profile:', response.data.user);
              setUser(response.data.user);
              console.log('User set, isAuthenticated should now be true');
            } else {
              throw new Error('Failed to get user profile');
            }
          } else {
            console.log('Token expired, clearing auth');
            // Token expired
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Token validation error:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('No token, setting user to null');
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function
  const login = async (phone, password, role) => {
    try {
      setLoading(true);
      const response = await authAPI.login(phone, password, role);
      
      if (response.success) {
        console.log('Setting user data:', response.data.user);
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        console.log('User and token set in login, isAuthenticated should be true');
        return { success: true, user: response.data.user };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.status === 'success') {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated: !!user || (!!token && !loading)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { useAuth, AuthProvider };