import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/services/api';

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextData {
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const TOKEN_KEY = 'supmap_token';
const USER_KEY = 'supmap_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_KEY);

        if (storedToken && storedUser) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setState({
            token: storedToken,
            user: JSON.parse(storedUser),
            isAuthenticated: true,
          });
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Error loading auth data', error);
        router.replace('/(auth)/login');
      }
    };

    loadStoredData();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/authenticate', { email, password });
      const { token, user } = response.data.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      setState({
        token,
        user,
        isAuthenticated: true,
      });

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Authentication error', error);
      throw error;
    }
  };

  const signUp = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });

      const { token, user } = response.data.data;

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      setState({
        token,
        user,
        isAuthenticated: true,
      });

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Registration error', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);

      delete api.defaults.headers.common['Authorization'];

      setState({
        token: null,
        user: null,
        isAuthenticated: false,
      });

      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (state.user?.id) {
        const response = await api.put(`/api/users/update/${state.user.id}`, userData);
        const updatedUser = response.data.data;
        
        const newUser = { ...state.user, ...updatedUser };
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
        
        setState({
          ...state,
          user: newUser,
        });
      }
    } catch (error) {
      console.error('Update user error', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ state, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};