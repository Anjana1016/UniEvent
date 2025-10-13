import React, { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Navigate } from 'react-router-dom';
import { useUserAuthStore } from '@/stores/userAuthStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AuthenticatedUser = ({ children }) => {
    const { user, userLogout, isUserLoading, isUserAuthenticated, isCheckingAuth, initializeAuth } = useUserAuthStore();
    const navigate = useNavigate();

    const initialize = useCallback(() => {
        // Only initialize if we don't have children (auth route wrapper) or if we need to check auth
        if (!children || !isUserAuthenticated) {
            initializeAuth();
        }
    }, [initializeAuth, children, isUserAuthenticated]);

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
        // Redirect to user dashboard if already authenticated
        if (isUserAuthenticated && user) {
            return <Navigate to={`/user/${user._id}/${encodeURIComponent(user.email)}`} replace />;
        }
        // Show login/signup form if not authenticated
        return children;
    }

    // If being used as a user info component (no children)
    const handleLogout = async () => {
        try {
            await userLogout();
            toast.success("Logged out successfully!");
            navigate('/');
        } catch (error) {
            toast.error(error.message || "Logout failed");
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                        {user.userName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                {/* <span className="text-sm font-medium">{user.userName}</span> */}
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                disabled={isUserLoading}
            >
                {isUserLoading ? "Logging out..." : "Logout"}
            </Button>
        </div>
    );
};

export default AuthenticatedUser;