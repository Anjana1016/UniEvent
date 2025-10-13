import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useUserAuthStore } from '@/stores/userAuthStore';
import { useEventStore } from '@/stores/eventStore';
import UserHeader from '@/components/includes/user/UserHeader';
import { Clock, MapPin, Calendar as CalendarIcon, HelpCircle, Settings, Ticket } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

const UserDashboard = () => {
    const { user, isUserAuthenticated } = useUserAuthStore();
    const { isLoading, fetchEvents } = useEventStore();
    const navigate = useNavigate();
    const [recentEvents, setRecentEvents] = useState([]);
    const [closestEvent, setClosestEvent] = useState(null);

    useEffect(() => {
        document.title = `${user?.userName || 'User'}'s Dashboard`;
    }, [user]);

    useEffect(() => {
        // Fetch recent events when component mounts
        const fetchRecentEvents = async () => {
            try {
                const result = await fetchEvents({
                    limit: 3,
                    page: 1,
                    showPast: false
                });
                if (result.success) {
                    setRecentEvents(result.data.events || []);
                }
            } catch (error) {
                console.error('Failed to fetch recent events:', error);
            }
        };

        // Fetch closest upcoming event
        const fetchClosestEvent = async () => {
            try {
                const result = await fetchEvents({
                    limit: 50, // Get more events to find the truly closest one
                    page: 1,
                    showPast: false
                });
                if (result.success && result.data.events?.length > 0) {
                    // Sort events by date and time to find the closest one
                    const sortedEvents = result.data.events.sort((a, b) => {
                        const dateA = new Date(`${a.eventDate}T${a.eventTime}`);
                        const dateB = new Date(`${b.eventDate}T${b.eventTime}`);
                        return dateA - dateB;
                    });
                    setClosestEvent(sortedEvents[0]);
                }
            } catch (error) {
                console.error('Failed to fetch closest event:', error);
            }
        };

        fetchRecentEvents();
        fetchClosestEvent();
    }, [fetchEvents]);

    if (!isUserAuthenticated || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-600">Not authenticated</h2>
                    <p className="text-gray-500">Please log in to continue</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <UserHeader />

            <div className=' flex'>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-6 gap-6 auto-rows-[200px]">

                        {/* Welcome Card */}
                        <div className="col-span-3 bg-background border-2 hover:bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center mb-4">
                                    <h2 className="text-3xl font-semibold">Welcome Back {user?.userName}!</h2>
                                </div>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Clock className="h-5 w-5 mr-2" />
                                <span>{new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="col-span-3 row-span-2 bg-background border-2 hover:bg-gradient-to-br from-gray-800 to-gray-00 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-between">
                            <div className=' w-full h-full flex items-center justify-center'>
                                <Calendar />
                            </div>
                        </div>

                        {/* Calendar Widget */}
                        <div className=" flex bg-background border-2 hover:bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                            onClick={() => navigate('/find-events')}
                        >
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <Ticket className="h-10 w-10 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-semibold">Browse Events</h3>
                            </div>
                        </div>

                        {/* Navigation - Help */}
                        <div className="col-span-2 bg-background border-2 hover:bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                            onClick={() => navigate('/contact-us')}
                        >
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <HelpCircle className="h-10 w-10 mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-semibold">Get Help</h3>
                            </div>
                        </div>

                        {/* Closest Event Card */}
                        <div className="col-span-2 bg-background border-2 hover:bg-gradient-to-br from-blue-500 to-rose-600 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                            onClick={() => closestEvent && navigate(`/event/${closestEvent._id}`)}>
                            <div className="flex items-center mb-4">
                                <CalendarIcon className="h-6 w-6 mr-3" />
                                <h3 className="text-lg font-semibold">Upcoming Event</h3>
                            </div>
                            {closestEvent ? (
                                <div className="text-center">
                                    <p className="text-2xl font-bold mb-2 line-clamp-1">
                                        {closestEvent.eventName}
                                    </p>
                                    <p className="text-blue-100 text-sm mb-1">
                                        {new Date(closestEvent.eventDate).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-blue-200 text-sm">
                                        {new Date(`2000-01-01T${closestEvent.eventTime}`).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </p>
                                    <div className="text-blue-200 text-xs mt-2 flex items-center justify-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span className="line-clamp-1">{closestEvent.location}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-2xl font-bold mb-2">
                                        No Events
                                    </p>
                                    <p className="text-blue-100 text-sm">
                                        No upcoming events found
                                    </p>
                                    <p className="text-blue-200 text-xs mt-2">
                                        Check back later
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        <div className="col-span-2 bg-background hover:bg-gradient-to-r from-green-500 to-emerald-600 border-2 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <Settings className="h-10 w-10 mb-3 group-hover:rotate-90 transition-transform duration-300" />
                                <h3 className="text-lg font-semibold">Settings</h3>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="col-span-2 bg-background border-2 hover:bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-xl font-bold">
                                        {user?.userName?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">{user.userName}</h3>
                                    <p className="text-teal-100 text-sm">{user.email}</p>
                                </div>
                            </div>
                            <div>
                                <p className='text-sm group-hover:text-white/90'><span className='opacity-75'>Contact:</span> {user.contactNumber || 'Not provided'}</p>
                                <p className='text-sm group-hover:text-white/90'><span className='opacity-75'>Joined:</span> {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }) : 'Unknown'}</p>
                                <p className='text-sm group-hover:text-white/90'><span className='opacity-75'>Last Login:</span> {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }) : 'Unknown'}</p>
                            </div>
                        </div>

                    </div>
                </main>

            </div>
        </div>
    );
};

export default UserDashboard