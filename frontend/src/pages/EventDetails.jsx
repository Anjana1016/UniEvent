import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/includes/Header';
import Footer from '@/components/includes/Footer';
import { Button } from '@/components/ui/button';
import { useEventStore } from '@/stores/eventStore';
import { 
    Calendar, 
    MapPin, 
    Clock, 
    Mail,
    Loader2,
    ArrowLeft,
    Share2,
    Heart,
    BookOpen,
    Tag,
    AlertCircle,
    CircleDollarSign
} from 'lucide-react';
import { toast } from 'sonner';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchEventById, isLoading, error } = useEventStore();
    
    const [event, setEvent] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const result = await fetchEventById(id);
                if (result.success) {
                    setEvent(result.data);
                    document.title = `${result.data.eventName} - UniEvent`;
                } else {
                    toast.error('Failed to load event details');
                }
            } catch (err) {
                console.error('Failed to load event:', err);
                toast.error('Failed to load event details');
            }
        };

        if (id) {
            loadEvent();
        }
    }, [id, fetchEventById]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event.eventName,
                    text: event.description,
                    url: window.location.href,
                });
                toast.success('Event shared successfully!');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    fallbackShare();
                }
            }
        } else {
            fallbackShare();
        }
    };

    const fallbackShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Event link copied to clipboard!');
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                        <span className="ml-3 text-lg">Loading event details...</span>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Error state
    if (error || !event) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center py-20">
                        <AlertCircle className="mx-auto h-24 w-24 mb-6 text-red-500" />
                        <h3 className="text-2xl font-semibold mb-2">Event Not Found</h3>
                        <p className="text-gray-500 text-lg mb-6">
                            {error || 'The event you\'re looking for doesn\'t exist or has been removed.'}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button 
                                onClick={() => navigate('/find-events')}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Browse Events
                            </Button>
                            <Button 
                                onClick={() => navigate(-1)}
                                variant="outline"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Go Back
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const isPast = isEventPast(event.eventDate);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back button */}
                <Button 
                    onClick={() => navigate(-1)}
                    className="mb-6 bg-background hover:bg-blue-600 border text-muted-foreground hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                {/* Event Header */}
                <div className="bg-background text-muted-foreground rounded-xl border overflow-hidden shadow-lg mb-8">
                    {/* Hero Image */}
                    <div className="relative h-80 md:h-96">
                        {imageLoading && !imageError && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        
                        {imageError ? (
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <Calendar className="h-20 w-20 mx-auto mb-4 opacity-80" />
                                    <h1 className="text-4xl font-semibold mb-2">{event.eventName}</h1>
                                    <p className="text-xl opacity-90">Event Details</p>
                                </div>
                            </div>
                        ) : (
                            <img
                                src={event.eventThumbnailImage}
                                alt={event.eventName}
                                className={`w-full h-full object-cover ${imageLoading ? 'opacity-0 absolute' : 'opacity-100'}`}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                        )}

                        {/* Overlay badges */}
                        {(!imageLoading || imageError) && (
                            <>
                                {/* Price badge */}
                                <div className="absolute top-6 right-6">
                                    {event.isFreeEvent ? (
                                        <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-base font-semibold shadow-lg">
                                            FREE
                                        </span>
                                    ) : (
                                        <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-lg font-semibold shadow-lg">
                                            RS.{event.price}
                                        </span>
                                    )}
                                </div>

                                {/* Past event badge */}
                                {isPast && (
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-gray-500 text-white px-4 py-2 rounded-full text-lg font-semibold shadow-lg">
                                            Past Event
                                        </span>
                                    </div>
                                )}

                                {/* Share button */}
                                <div className="absolute bottom-6 right-6">
                                    <Button
                                        onClick={handleShare}
                                        className="bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg"
                                        size="sm"
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Event Title and Quick Info */}
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-4xl font-semibold mb-4">{event.eventName}</h1>
                                
                                {/* Quick event info */}
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                                        <div>
                                            <p className="font-semibold">{formatDate(event.eventDate)}</p>
                                            <p className="text-sm">{formatTime(event.eventTime)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <MapPin className="h-5 w-5 mr-3 text-blue-500" />
                                        <div>
                                            <p className="font-semibold">Location</p>
                                            <p className="text-sm">{event.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col gap-3 min-w-[200px]">
                                <Button
                                    onClick={() => handleContactOrganizer(event.email)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    size="lg"
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Contact Organizer
                                </Button>
                                
                                {!isPast && (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-blue-500 text-white hover:bg-blue-50 dark:hover:bg-blue-950"
                                    >
                                        <Heart className="h-4 w-4 mr-2" />
                                        Save Event
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Details Content */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-background text-muted-foreground rounded-xl border p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <BookOpen className="h-6 w-6 mr-3 text-blue-500" />
                                About This Event
                            </h2>
                            <div className="prose prose-gray dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                    {event.description}
                                </p>
                            </div>
                        </div>

                        {/* Additional Info (if we had more fields) */}
                        <div className="bg-background text-muted-foreground rounded-xl border p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Tag className="h-6 w-6 mr-3 text-blue-500" />
                                Event Details
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Event Type</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {event.isFreeEvent ? 'Free Event' : 'Paid Event'}
                                    </p>
                                </div>
                                
                                {!event.isFreeEvent && (
                                    <div>
                                        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Ticket Price</h3>
                                        <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                                            RS.{event.price}
                                        </p>
                                    </div>
                                )}
                                
                                <div>
                                    <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Status</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        isPast 
                                            ? 'bg-gray-100 text-gray-600 dark:bg-gray-800' 
                                            : 'bg-blue-100 text-white dark:bg-blue-900'
                                    }`}>
                                        {isPast ? 'Event Ended' : 'Upcoming'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Date & Time Card */}
                        <div className="bg-background text-muted-foreground rounded-xl border p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                                Schedule
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</p>
                                    <p className="font-semibold">{formatDate(event.eventDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Time</p>
                                    <p className="font-semibold">{formatTime(event.eventTime)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-background text-muted-foreground rounded-xl border p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                                Location
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {event.location}
                            </p>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-background text-muted-foreground rounded-xl border p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center">
                                <Mail className="h-5 w-5 mr-2 text-blue-500" />
                                Organizer
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contact Email</p>
                                    <p className="font-medium text-blue-600 dark:text-blue-400 break-all">
                                        {event.email}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => handleContactOrganizer(event.email)}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Message
                                </Button>
                            </div>
                        </div>

                        {/* Price Card */}
                        {!event.isFreeEvent ? (
                            <div className="bg-background text-muted-foreground rounded-xl border p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center">
                                    <CircleDollarSign className="h-5 w-5 mr-2 text-blue-500" />
                                    Pricing
                                </h3>
                                <div className="text-center">
                                    <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
                                        RS.{event.price}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        per ticket
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-6 text-white">
                                <h3 className="font-semibold text-lg mb-2 text-center">
                                    🎉 Free Event!
                                </h3>
                                <p className="text-center text-sm opacity-90">
                                    No ticket required - just show up!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Call to Action Section */}
                {!isPast && (
                    <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-8 text-center border">
                        <h2 className="text-2xl font-semibold mb-4">Ready to Join?</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                            Don't miss out on this amazing event! Contact the organizer for more information or to secure your spot.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => handleContactOrganizer(event.email)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                size="lg"
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Get More Info
                            </Button>
                            <Button
                                onClick={handleShare}
                                variant="outline"
                                size="lg"
                            >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Event
                            </Button>
                        </div>
                    </div>
                )}
            </main>
            
            <Footer />
        </div>
    );
};

export default EventDetails;