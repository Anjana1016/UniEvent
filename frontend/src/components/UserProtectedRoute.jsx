import React, { useEffect, useCallback } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useUserAuthStore } from '@/stores/userAuthStore';

const UserProtectedRoute = ({ children }) => {
    const { isUserAuthenticated, isCheckingAuth, initializeAuth, user } = useUserAuthStore();
    const location = useLocation();
    const { userId, email } = useParams();

    const initialize = useCallback(() => {
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Show loading while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isUserAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Validate that the URL userId matches the authenticated user's ID
    if (user && userId && user._id !== userId) {
        return <Navigate to={`/user/${user._id}/${encodeURIComponent(user.email)}`} replace />;
    }

    // If user is authenticated but no userId in URL, redirect to correct URL
    if (user && !userId) {
        return <Navigate to={`/user/${user._id}/${encodeURIComponent(user.email)}`} replace />;
    }

    // Render protected content if authenticated and URL matches
    return children;
};

export default UserProtectedRoute;