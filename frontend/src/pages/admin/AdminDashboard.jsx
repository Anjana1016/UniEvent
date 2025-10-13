import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { useAdminStore } from '@/stores/adminStore';
import AdminHeader from '@/components/includes/admin/AdminHeader';
import AdminSideBar from '@/components/includes/admin/AdminSideBar';
import StatCard from '@/components/includes/admin/StatCard';
import RecentEvents from '@/components/includes/admin/RecentEvents';
import { toast } from 'sonner';
import { Calendar, CircleDollarSign, CirclePlus, FileText, RefreshCcw, User } from 'lucide-react';

const AdminDashboard = () => {
    const {
        admin,
        isAdminAuthenticated,
        isCheckingAuth,
        initializeAuth,
    } = useAdminAuthStore();

    const {
        dashboardStats,
        recentEvents,
        fetchDashboardStats,
        fetchRecentEvents,
        isLoading: statsLoading,
        error: statsError
    } = useAdminStore();

    const { adminId, email } = useParams();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        // Initialize auth check on component mount
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        // Fetch dashboard stats when component mounts and admin is authenticated
        if (isAdminAuthenticated && admin) {
            console.log('Admin authenticated, fetching dashboard data...');
            fetchDashboardStats().then(result => {
                console.log('Dashboard stats fetch result:', result);
            });
            fetchRecentEvents(5).then(result => {
                console.log('Recent events fetch result:', result);
            });
        }
    }, [isAdminAuthenticated, admin, fetchDashboardStats, fetchRecentEvents]);

    useEffect(() => {
        document.title = `${admin?.adminName || 'Admin'}'s Dashboard`;
    }, [admin?.adminName]);

    // Show loading while checking auth
    if (isCheckingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Verifying authentication...</p>
                </div>
            </div>
        )
    }

    // Redirect if not authenticated
    if (!isAdminAuthenticated || !admin) {
        navigate('/secure-auth/admin-login')
        return null
    }

    // Verify URL params match authenticated admin
    if (admin._id !== adminId || decodeURIComponent(email) !== admin.email) {
        toast.error('Unauthorized access')
        navigate('/secure-auth/admin-login')
        return null
    }

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AdminHeader />

            <div className=' flex'>

                <AdminSideBar
                    isCollapsed={sidebarCollapsed}
                    onToggle={handleSidebarToggle}
                />

                {/* Main Content */}
                <main className="flex-1">
                    <div className="p-6 space-y-6">
                        {/* Welcome Section */}
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Welcome back, {admin.adminName}!
                            </h1>
                            <p className="text-muted-foreground">
                                Here's what's happening with Uni<span className=' text-blue-500'>Event</span> today
                            </p>
                        </div>

                        {/* Error Display */}
                        {statsError && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <h4 className="font-medium text-red-800 dark:text-red-200">Error loading dashboard data:</h4>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{statsError}</p>
                                <button 
                                    onClick={() => {
                                        fetchDashboardStats();
                                        fetchRecentEvents(5);
                                    }}
                                    className="mt-2 px-3 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded text-sm hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Events"
                                value={statsLoading ? '...' : dashboardStats.totalEvents}
                                icon={<Calendar />}
                                trend="up"
                                trendValue={`+${dashboardStats.eventsThisMonth}`}
                            />
                            <StatCard
                                title="Total Users"
                                value={statsLoading ? '...' : dashboardStats.totalUsers}
                                trend="up"
                                trendValue={`+${dashboardStats.totalUsers}`}
                                icon={<User />}
                            />
                            <StatCard
                                title="Free Events"
                                value={statsLoading ? '...' : dashboardStats.freeEvents}
                                trend="up"
                                trendValue={`+${dashboardStats.freeEvents}`}
                                icon={<FileText />}
                            />
                            <StatCard
                                title="Paid Events"
                                value={statsLoading ? '...' : dashboardStats.paidEvents}
                                trend="up"
                                trendValue={`+${dashboardStats.paidEvents}`}
                                icon={<CircleDollarSign />}
                            />
                        </div>

                        {/* Additional Dashboard Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Events */}
                            <div className="lg:col-span-2">
                                <RecentEvents events={recentEvents} isLoading={statsLoading} />
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-background text-muted-foreground rounded-lg shadow-md p-6 border">
                                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate(`/admin/${admin._id}/${encodeURIComponent(admin.email)}/events`)}
                                        className="w-full text-left p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-blue-500"><CirclePlus /></span>
                                            <span className="text-sm font-medium">Add New Event</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => navigate('/find-events')}
                                        className="w-full text-left p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-blue-500"><FileText /></span>
                                            <span className="text-sm font-medium">View All Events</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="w-full text-left p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-blue-500"><RefreshCcw /></span>
                                            <span className="text-sm font-medium">Refresh Dashboard</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default AdminDashboard;