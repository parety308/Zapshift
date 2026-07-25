import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth/useAuth';

/**
 * RoleRoute
 * ------------------------------------------------------------------
 * Wrap a route element in <RoleRoute roles={['admin']}> to restrict it
 * to specific user roles. Combine with PrivateRoutes if you also need
 * to guarantee the user is logged in first:
 *
 *   <PrivateRoutes>
 *     <RoleRoute roles={['admin']}><ManageUsers /></RoleRoute>
 *   </PrivateRoutes>
 *
 * `user.role` is currently set locally by the UI-only Login / SignUp
 * forms (see AuthProvider.jsx). Once you have a real backend, make
 * sure the role you store on the user object comes from your server,
 * never from client input.
 * ------------------------------------------------------------------
 */
const RoleRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <span className="loading loading-bars loading-lg block mx-auto my-10"></span>;
    }

    if (!user) {
        return <Navigate to="/auth/login" state={location.pathname} />;
    }

    if (roles.length && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default RoleRoute;
