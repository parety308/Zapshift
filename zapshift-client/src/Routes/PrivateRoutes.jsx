import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth/useAuth';

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center my-20">
                <span className="loading loading-bars loading-lg"></span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth/login" state={location.pathname}></Navigate>;
    }

    return children;
};

export default PrivateRoutes;
