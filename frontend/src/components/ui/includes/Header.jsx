import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useUserAuthStore } from '@/stores/userAuthStore'
import { useAdminAuthStore } from '@/stores/adminAuthStore'
import AuthenticatedUser from '../AuthenticatedUser'
import AuthenticatedAdmin from '../AuthenticatedAdmin'
import { Avatar, AvatarFallback } from '../ui/avatar'

const Header = () => {

    const navigate = useNavigate();
    const { user, isUserAuthenticated, initializeAuth: initUserAuth } = useUserAuthStore();
    const { isAdminAuthenticated, initializeAuth: initAdminAuth } = useAdminAuthStore();

    useEffect(() => {
        initUserAuth();
        initAdminAuth();
    }, [initUserAuth, initAdminAuth]);

    const handleProfileClick = () => {
        navigate(`/user/${user._id}/${encodeURIComponent(user.email)}`);
    };

    return (
        <header className="p-4 border-b border-border">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link to="/">
                    <h1 className="text-3xl font-bold flex gap-2">
                        <span className=" text-primary-foreground font-bold text-sm">
                            <img
                                src="/uni-logo-dark.png"
                                alt="Logo"
                                className=' h-10 w-10 rounded-lg'
                            />
                        </span>
                        <h1>Uni<span className=' text-blue-500'>Event</span></h1>
                    </h1>
                </Link>

                <div className=' flex items-center gap-4'>
                    <div className=' space-x-5'>
                        <Link className=' text-sm hover:text-blue-500' to="/">
                            Home
                        </Link>
                        <Link className=' text-sm hover:text-blue-500' to="/find-events">
                            Find Event
                        </Link>
                        <Link className=' text-sm hover:text-blue-500' to="/contact-us">
                            Contact Us
                        </Link>
                    </div>

                    {/* Show user or admin info if authenticated, otherwise show login buttons */}
                    {isUserAuthenticated ? (
                        <div
                            className="flex items-center gap-2 cursor-pointer transition-transform"
                            onClick={handleProfileClick}
                            title={`Go to ${user.userName}'s profile`}
                        >
                            <Avatar className="h-8 w-8 transition-all duration-200">
                                <AvatarFallback className="bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                    {user.userName?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            {/* <span className="text-sm font-medium">{user.userName}</span> */}
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                className=" bg-transparent hover:bg-blue-600 text-white"
                                onClick={() => navigate('/auth/login')}
                            >
                                Login
                            </Button>
                            <Button
                                className="bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() => navigate('/auth/signup')}
                            >
                                Sign up
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </header >
    )
}

export default Header