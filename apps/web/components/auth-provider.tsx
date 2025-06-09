'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Cookies from 'js-cookie';

/**
 * GraphQL query to fetch the current authenticated user.
 */
const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      role
    }
  }
`;

interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

/**
 * React context for authentication state and actions.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider wraps your app and provides authentication state and actions.
 *
 * @param children - React children nodes
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { data, loading, refetch } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore',
    fetchPolicy: 'network-only', // Always check server for user
  });

  useEffect(() => {
    setUser(data?.me ?? null);
  }, [data]);

  /**
   * Stores JWT token in cookies and refetches user data.
   * @param token - JWT token string
   */
  const login = useCallback((token: string) => {
    Cookies.set('token', token, { expires: 7 });
    refetch();
  }, [refetch]);

  /**
   * Removes JWT token from cookies and clears user state.
   */
  const logout = useCallback(() => {
    Cookies.remove('token');
    setUser(null);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    login,
    logout,
    loading,
  }), [user, login, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}