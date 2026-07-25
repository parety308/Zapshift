import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth/useAuth';

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <span className="loading loading-bars loading-lg block mx-auto my-10"></span>;
    }

    if (!user) {
        return <Navigate to="/auth/login" state={location.pathname} />;
    }

    return children;
};

export default PrivateRoutes;
