"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string | null;
  imageUrl: string;
  id: string;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
}

interface UserContextType {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  loggedinUser: User | null;
  setLoggedinUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loggedinUser, setLoggedinUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser, loggedinUser, setLoggedinUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
