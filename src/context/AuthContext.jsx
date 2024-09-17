import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

// Create AuthContext
export const AuthContext = createContext();

// AuthContextProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to login user
  const login = async (email, password) => {
    try {
      const usersRef = collection(db, 'employees');
      const q = query(usersRef, where('email', '==', email), where('password', '==', password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User authenticated successfully
        const userData = querySnapshot.docs[0].data();
        setCurrentUser({ ...userData, id: querySnapshot.docs[0].id });
        navigate('/home');
      } else {
        // Invalid credentials
        toast.error('Email ou senha inválidos');
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in: ', error);
      throw error;
    }
  };

  // Function to logout user
  const logout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  // Check if a user is already logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Store the user in localStorage when logged in
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  return <AuthContext.Provider value={{ currentUser, login, logout, setCurrentUser }}>{!loading && children}</AuthContext.Provider>;
};
