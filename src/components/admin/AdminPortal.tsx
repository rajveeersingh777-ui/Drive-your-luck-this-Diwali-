import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

interface AdminPortalProps {
  onBackToPublic: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToPublic }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('dwl_admin_session');
    const storedUser = sessionStorage.getItem('dwl_admin_user');
    if (sessionToken) {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setAdminUser(JSON.parse(storedUser));
        } catch (e) {}
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = (_token: string, user: any) => {
    setIsAuthenticated(true);
    setAdminUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dwl_admin_session');
    sessionStorage.removeItem('dwl_admin_user');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} onBackToPublic={onBackToPublic} />;
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
      onBackToPublic={onBackToPublic}
      adminUser={adminUser}
    />
  );
};
