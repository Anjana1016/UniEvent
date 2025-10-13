import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/includes/Header';
import Footer from '@/components/includes/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEventStore } from '@/stores/eventStore';
import {
    Search,
    Filter,
    Calendar,
    MapPin,
    Mail,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useUserAuthStore } from '@/stores/userAuthStore';

const FindEvents = () => {
    const navigate = useNavigate();
    const {
        events,
        isLoading,
        error,
        pagination,
        fetchEvents,
        searchEvents,
        filterEvents,
        goToPage,
        filters
    } = useEventStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all'); // all, free, paid
    const [showPast, setShowPast] = useState(false);
    const [imageLoadingStates, setImageLoadingStates] = useState({});
    const [imageErrors, setImageErrors] = useState({});
    const { isUserAuthenticated } = useUserAuthStore();

    useEffect(() => {
        document.title = "Find Events - UniEvent";
        // Load events on component mount
        fetchEvents({ ...filters, showPast: false }); // Default to not showing past events
    }, [fetchEvents]);

    // Initialize images as loading when events are fetched
    useEffect(() => {
        if (events.length > 0) {
            setImageLoadingStates(prev => {
                const newLoadingStates = { ...prev };
                events.forEach(event => {
                    // Only set loading state for new events that haven't been processed
                    if (!(event._id in newLoadingStates)) {
                        newLoadingStates[event._id] = true;
                    }
                });
                return newLoadingStates;
            });
        }
    }, [events]);

    const handleSearch = async (e) => {
        e.preventDefault();
        await searchEvents(searchTerm, { showPast });
    };

    const handleFilterChange = async (filterType) => {
        setSelectedFilter(filterType);
        let isFree;

        if (filterType === 'free') {
            isFree = true;
        } else if (filterType === 'paid') {
            isFree = false;
        } else {
            isFree = undefined;
        }

        await filterEvents({
            isFree,
            showPast
        });
    };

    const handleShowPastToggle = async () => {
        const newShowPast = !showPast;
        setShowPast(newShowPast);

        let isFree;
        if (selectedFilter === 'free') {
            isFree = true;
        } else if (selectedFilter === 'paid') {
            isFree = false;
        }

        await filterEvents({
            isFree,
            showPast: newShowPast
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const isEventPast = (eventDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(eventDate) < today;
    };

    const handleContactOrganizer = (email) => {
        window.open(`mailto:${email}`, '_blank');
    };

    const handleImageLoad = (eventId) => {
        setImageLoadingStates(prev => ({
            ...prev,
            [eventId]: false
        }));
    };

    const handleImageError = (eventId) => {
        setImageLoadingStates(prev => ({
            ...prev,
            [eventId]: false
        }));
        setImageErrors(prev => ({
            ...prev,
            [eventId]: true
        }));
    };

    const handleViewDetails = (eventId) => {
        if (!isUserAuthenticated) {
            navigate('/auth/login');
            return;
        }

        navigate(`/event/${eventId}`);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="container mx-auto px-4 py-8">

                {/* Search and Filters */}
                <div className="mb-8">
                    <div className="bg-background text-muted-foreground p-6 rounded-lg border shadow-sm">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                                    <Input
                                        placeholder="Search for events..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 h-12"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8"
                                    disabled={isLoading}
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </form>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <select
                                        value={selectedFilter}
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                        className="rounded-md border bg-background text-muted-foreground px-3 py-2 text-sm "
                                    >
                                        <option value="all">All Events</option>
                                        <option value="free">Free Events</option>
                                        <option value="paid">Paid Events</option>
                                    </select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="showPastEvents"
                                        checked={showPast}
                                        onChange={handleShowPastToggle}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="showPastEvents" className="text-sm">
                                        Show past events
                                    </label>
                                </div>
                            </div>

                            {pagination.totalEvents > 0 && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {pagination.totalEvents} event{pagination.totalEvents !== 1 ? 's' : ''} found
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="space-y-6">
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                            <span className="ml-3 text-lg">Loading events...</span>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-20">
                            <div className="text-red-500 mb-4">
                                <p className="text-lg">Error loading events</p>
                                <p className="text-sm">{error}</p>
                            </div>
                            <Button
                                onClick={() => fetchEvents(filters)}
                                variant="outline"
                            >
                                Try Again
                            </Button>
                        </div>
                    )}

                    {!isLoading && !error && events.length === 0 && (
                        <div className="text-center py-20">
                            <Calendar className="mx-auto h-24 w-24 mb-6 text-gray-300" />
                            <h3 className="text-2xl font-semibold mb-2">No events found</h3>
                            <p className="text-gray-500 text-lg">
                                Try adjusting your search terms or filters to find more events.
                            </p>
                        </div>
                    )}

                    {!isLoading && !error && events.length > 0 && (
                        <>
                            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                                {events.map((event) => {
                                    const isPast = isEventPast(event.eventDate);
                                    const isImageLoading = imageLoadingStates[event._id];
                                    const hasImageError = imageErrors[event._id];

                                    return (
                                        <div key={event._id} className={`bg-background text-muted-foreground rounded-xl border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isPast ? 'opacity-75' : ''}`}>
                                            <div className="relative">
                                                {isImageLoading && !hasImageError && (
                                                    <div className="w-full h-52 bg-gray-200 animate-pulse flex items-center justify-center">
                                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                                    </div>
                                                )}

                                                {hasImageError ? (
                                                    <div className="w-full h-52 bg-gray-100 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                                            <p className="text-sm text-muted-foreground">Image not available</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={event.eventThumbnailImage}
                                                        alt={event.eventName}
                                                        className={`w-full h-52 object-cover ${isImageLoading ? 'opacity-0 absolute' : 'opacity-100'}`}
                                                        onLoad={() => handleImageLoad(event._id)}
                                                        onError={() => handleImageError(event._id)}
                                                    />
                                                )}

                                                {/* Price badge - only show when image is loaded or has error */}
                                                {(!isImageLoading || hasImageError) && (
                                                    <div className="absolute top-3 right-3">
                                                        {event.isFreeEvent ? (
                                                            <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                                FREE
                                                            </span>
                                                        ) : (
                                                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                                RS.{event.price}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Past event badge */}
                                                {(!isImageLoading || hasImageError) && isPast && (
                                                    <div className="absolute top-3 left-3">
                                                        <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                            Past Event
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6 space-y-4">

                                                <div className="space-y-3 text-gray-600 dark:text-gray-300">

                                                    <div className="flex items-center">
                                                        <span className="font-medium">
                                                            {event.eventName}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <Calendar className="h-5 w-5 mr-3" />
                                                        <span className="font-medium">
                                                            {formatDate(event.eventDate)} at {formatTime(event.eventTime)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div className="flex items-center">
                                                            <MapPin className="h-5 w-5 mr-3" />
                                                            <span className="line-clamp-1">{event.location}</span>
                                                        </div>

                                                        <div>
                                                            {!event.isFreeEvent && (
                                                                <div className="flex items-center">
                                                                    {/* <DollarSign className="h-5 w-5 mr-3 text-green-500" /> */}
                                                                    <span className="font-semibold text-blue-500">
                                                                        RS.{event.price}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="pt-4 border-t flex gap-2">
                                                    <Button
                                                        onClick={() => handleViewDetails(event._id)}
                                                        variant="outline"
                                                        className="flex-1"
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleContactOrganizer(event.email)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                        size="sm"
                                                    >
                                                        <Mail className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-center mt-12">
                                    <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 px-6 py-3 border rounded-lg shadow-sm">
                                        <Button
                                            onClick={() => goToPage(pagination.currentPage - 1)}
                                            disabled={!pagination.hasPrevPage || isLoading}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Previous
                                        </Button>

                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Page {pagination.currentPage} of {pagination.totalPages}
                                        </span>

                                        <Button
                                            onClick={() => goToPage(pagination.currentPage + 1)}
                                            disabled={!pagination.hasNextPage || isLoading}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FindEvents;