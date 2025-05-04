
import React from 'react';
import { Navigate } from 'react-router-dom';

interface IndexProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

// This component now only redirects to the main page
const Index: React.FC<IndexProps> = () => {
  return <Navigate to="/" replace />;
};

export default Index;
