import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

const RecentEvents = ({ events, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-background text-muted-foreground rounded-lg shadow-md p-6 border">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center space-x-3 animate-pulse">
                            <div className="w-12 h-12 bg-background rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-background rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-background rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background text-muted-foreground rounded-lg shadow-md p-6 border">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
            {events && events.length > 0 ? (
                <div className="space-y-3">
                    {events.map((event) => (
                        <div key={event._id} className="flex items-center space-x-3 p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-lg transition-colors border">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                                {event.eventThumbnailImage ? (
                                    <img 
                                        src={event.eventThumbnailImage} 
                                        alt={event.eventName}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <span className="text-blue-600 dark:text-blue-400"><Calendar /></span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                    {event.eventName}
                                </h4>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                                    <Badge variant={event.isFreeEvent ? "secondary" : "outline"} className="text-xs">
                                        {event.isFreeEvent ? 'Free' : `$${event.price}`}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2"><Calendar /></div>
                    <p className="text-gray-500 dark:text-gray-400">No events found</p>
                </div>
            )}
        </div>
    );
};

export default RecentEvents;