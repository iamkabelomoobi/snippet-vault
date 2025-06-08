'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Cookies from 'js-cookie';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { data, loading, refetch } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore',
  });

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
  }, [data]);

  const login = (token: string) => {
    Cookies.set('token', token, { expires: 7 });
    refetch();
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}