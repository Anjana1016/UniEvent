import React, { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Navigate } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AuthenticatedAdmin = ({ children }) => {
    const { admin, adminLogout, isAdminLoading, isAdminAuthenticated, isCheckingAuth, initializeAuth } = useAdminAuthStore();
    const navigate = useNavigate();

    const initialize = useCallback(() => {
        // Only initialize if we don't have children (auth route wrapper) or if we need to check auth
        if (!children || !isAdminAuthenticated) {
            initializeAuth();
        }
    }, [initializeAuth, children, isAdminAuthenticated]);

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

    // If being used as a route wrapper (has children)
    if (children) {
        // Redirect to admin dashboard if already authenticated
        if (isAdminAuthenticated && admin) {
            return <Navigate to={`/admin/${admin._id}/${encodeURIComponent(admin.email)}`} replace />;
        }
        // Show login form if not authenticated
        return children;
    }

    // If being used as an admin info component (no children)
    const handleLogout = async () => {
        try {
            await adminLogout();
            toast.success("Logged out successfully!");
            navigate('/secure-auth/admin-login');
        } catch (error) {
            toast.error(error.message || "Logout failed");
        }
    };

    if (!admin) {
        return null;
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-red-600 text-white">
                        {admin.adminName?.charAt(0).toUpperCase() || 'A'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{admin.adminName}</span>
                    <Badge variant="secondary" className="text-xs">Admin</Badge>
                </div>
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                disabled={isAdminLoading}
            >
                {isAdminLoading ? "Logging out..." : "Logout"}
            </Button>
        </div>
    );
};

export default AuthenticatedAdmin;