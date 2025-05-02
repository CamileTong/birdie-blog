import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    // check if already logged in
    const storedUser = authAPI.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);
  
  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  const logout = () => {
    authAPI.logout();
    setUser(null);
    router.push('/');
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}