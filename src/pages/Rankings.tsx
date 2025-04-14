
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Rankings = () => {
  // Cette page n'est plus utilisée, elle redirige vers /tools
  return <Navigate to="/tools" replace />;
};

export default Rankings;
