import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, DollarSign, Clock, Mail, Eye } from 'lucide-react';

const EventCard = ({ 
    event, 
    onViewDetails, 
    onContact, 
    showActions = true, 
    showContactButton = true,
    className = "" 
}) => {
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

    const isPast = isEventPast(event.eventDate);

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg border overflow-hidden hover:shadow-lg transition-shadow ${isPast ? 'opacity-75' : ''} ${className}`}>
            <div className="relative">
                <img
                    src={event.eventThumbnailImage}
                    alt={event.eventName}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=${encodeURIComponent(event.eventName)}`;
                    }}
                />
                <div className="absolute top-3 right-3">
                    {event.isFreeEvent ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            FREE
                        </span>
                    ) : (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            ${event.price}
                        </span>
                    )}
                </div>
                {isPast && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Past Event
                        </span>
                    </div>
                )}
            </div>
            
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{event.eventName}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mt-1">
                        {event.description}
                    </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(event.eventDate)} at {formatTime(event.eventTime)}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {!event.isFreeEvent && (
                        <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>${event.price}</span>
                        </div>
                    )}
                </div>

                {showActions && (
                    <div className="pt-2 border-t">
                        <div className={`flex gap-2 ${showContactButton ? 'justify-between' : ''}`}>
                            <Button
                                onClick={() => onViewDetails && onViewDetails(event)}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </Button>
                            {showContactButton && (
                                <Button
                                    onClick={() => onContact && onContact(event.email)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    size="sm"
                                >
                                    <Mail className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;