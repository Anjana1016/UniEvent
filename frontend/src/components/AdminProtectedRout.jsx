import React, { useEffect, useCallback } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/adminAuthStore';

const AdminProtectedRoute = ({ children }) => {
    const { isAdminAuthenticated, isCheckingAuth, initializeAuth, admin } = useAdminAuthStore();
    const location = useLocation();
    const { adminId, email } = useParams();

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

    // Redirect to admin login if not authenticated
    if (!isAdminAuthenticated) {
        return <Navigate to="/secure-auth/admin-login" state={{ from: location }} replace />;
    }

    // Validate that the URL adminId matches the authenticated admin's ID
    if (admin && adminId && admin._id !== adminId) {
        return <Navigate to={`/admin/${admin._id}/${encodeURIComponent(admin.email)}`} replace />;
    }

    // If admin is authenticated but no adminId in URL, redirect to correct URL
    if (admin && !adminId) {
        return <Navigate to={`/admin/${admin._id}/${encodeURIComponent(admin.email)}`} replace />;
    }

    // Render protected content if authenticated and URL matches
    return children;
};

export default AdminProtectedRoute;