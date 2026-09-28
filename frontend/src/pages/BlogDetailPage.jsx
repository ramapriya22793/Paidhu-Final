import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const BlogDetailPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/shop/shop-all', { replace: true });
  }, [navigate]);

  return <Navigate to="/shop/shop-all" replace />;
};

export default BlogDetailPage;
