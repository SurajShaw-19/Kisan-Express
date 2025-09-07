import React from 'react';
import { Navigate } from 'react-router-dom';

const DashboardRedirect: React.FC = () => {
  return <Navigate to="/home" replace />;
};

export default DashboardRedirect;
