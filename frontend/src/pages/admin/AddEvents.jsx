import AdminHeader from '@/components/includes/admin/AdminHeader';
import AdminSideBar from '@/components/includes/admin/AdminSideBar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { useEventStore } from '@/stores/eventStore';
import { PlusCircle, Search, Filter, Calendar, MapPin, DollarSign, Eye, Loader2, ImageIcon, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AddEvents = () => {

    const {
        admin,
        isAdminAuthenticated,
        isCheckingAuth,
        initializeAuth,
    } = useAdminAuthStore();

    const {
        events,
        isLoading,
        error,
        pagination,
        addEvent,
        fetchEvents,
        searchEvents,
        filterEvents,
        goToPage,
        deleteEvent,
        filters
    } = useEventStore();

    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all'); // all, free, paid
    const [showPast, setShowPast] = useState(false);

    const [formData, setFormData] = useState({
        eventName: '',
        eventDate: '',
        eventTime: '',
        location: '',
        description: '',
        email: '',
        isFreeEvent: false,
        price: '',
        eventThumbnailImage: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageLoadingStates, setImageLoadingStates] = useState({});
    const [imageErrors, setImageErrors] = useState({});

    // Delete confirmation state
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        eventId: null,
        eventName: '',
        isDeleting: false
    });

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    useEffect(() => {
        document.title = "Add Events";
    }, []);

    // Load events on component mount
    useEffect(() => {
        if (isAdminAuthenticated) {
            fetchEvents(filters);
        }
    }, [isAdminAuthenticated, fetchEvents]);

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

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.eventName.trim()) {
            errors.eventName = 'Event name is required';
        }

        if (!formData.eventDate) {
            errors.eventDate = 'Event date is required';
        } else {
            const selectedDate = new Date(formData.eventDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                errors.eventDate = 'Event date cannot be in the past';
            }
        }

        if (!formData.eventTime) {
            errors.eventTime = 'Event time is required';
        }

        if (!formData.location.trim()) {
            errors.location = 'Location is required';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Contact email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                errors.email = 'Please provide a valid email address';
            }
        }

        if (!formData.eventThumbnailImage) {
            errors.eventThumbnailImage = 'Event thumbnail image is required';
        }

        if (!formData.isFreeEvent && (!formData.price || parseFloat(formData.price) <= 0)) {
            errors.price = 'Price is required for paid events and must be greater than 0';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            eventName: '',
            eventDate: '',
            eventTime: '',
            location: '',
            description: '',
            email: '',
            isFreeEvent: false,
            price: '',
            eventThumbnailImage: null,
        });
        setImagePreview(null);
        setFormErrors({});
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            const eventData = {
                eventName: formData.eventName.trim(),
                eventDate: formData.eventDate,
                eventTime: formData.eventTime,
                location: formData.location.trim(),
                description: formData.description.trim(),
                email: formData.email.trim().toLowerCase(),
                isFreeEvent: formData.isFreeEvent,
                eventThumbnailImage: formData.eventThumbnailImage,
            };

            // Add price only if it's not a free event
            if (!formData.isFreeEvent && formData.price) {
                eventData.price = parseFloat(formData.price);
            }

            const result = await addEvent(eventData);

            if (result.success) {
                resetForm();
                setIsDialogOpen(false);
            }
        } catch (error) {
            console.error('Error adding event:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Clear specific field error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Reset price when switching to free event
        if (name === 'isFreeEvent' && checked) {
            setFormData(prev => ({
                ...prev,
                price: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setFormData(prev => ({
                ...prev,
                eventThumbnailImage: file
            }));

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            // Clear error if it exists
            if (formErrors.eventThumbnailImage) {
                setFormErrors(prev => ({
                    ...prev,
                    eventThumbnailImage: ''
                }));
            }
        }
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

    const handleDeleteClick = (eventId, eventName) => {
        setDeleteConfirmation({
            isOpen: true,
            eventId: eventId,
            eventName: eventName,
            isDeleting: false
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));

            const result = await deleteEvent(deleteConfirmation.eventId);

            if (result.success) {
                setDeleteConfirmation({
                    isOpen: false,
                    eventId: null,
                    eventName: '',
                    isDeleting: false
                });
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        } finally {
            setDeleteConfirmation(prev => ({ ...prev, isDeleting: false }));
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmation({
            isOpen: false,
            eventId: null,
            eventName: '',
            isDeleting: false
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
                        <div className=' justify-between flex flex-col md:flex-row md:items-center '>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    Manage Events
                                </h1>
                                <p className="text-muted-foreground">
                                    Here you can add and manage events for Uni<span className=' text-blue-500'>Event</span>
                                </p>
                            </div>
                            <div>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className=" bg-blue-600 hover:bg-blue-700 text-white mt-4 md:mt-0"
                                        >
                                            <PlusCircle className="" />
                                            Add Event
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Add Event</DialogTitle>
                                            <p className="text-muted-foreground text-sm">
                                                Fill in the details below to add a new event.
                                            </p>
                                        </DialogHeader>

                                        <div className="space-y-4">
                                            <div className="grid gap-4">

                                                <div className="grid gap-2">
                                                    <Label htmlFor="eventName">Event Name</Label>
                                                    <Input
                                                        id="eventName"
                                                        name="eventName"
                                                        type="text"
                                                        placeholder="Enter event name"
                                                        value={formData.eventName}
                                                        onChange={handleInputChange}
                                                        className={formErrors.eventName ? 'border-red-500' : ''}
                                                    />
                                                    {formErrors.eventName && (
                                                        <p className="text-sm text-red-500">{formErrors.eventName}</p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="eventDate">Event Date</Label>
                                                        <Input
                                                            id="eventDate"
                                                            name="eventDate"
                                                            type="date"
                                                            value={formData.eventDate}
                                                            onChange={handleInputChange}
                                                            className={formErrors.eventDate ? 'border-red-500' : ''}
                                                        />
                                                        {formErrors.eventDate && (
                                                            <p className="text-sm text-red-500">{formErrors.eventDate}</p>
                                                        )}
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="eventTime">Event Time</Label>
                                                        <Input
                                                            id="eventTime"
                                                            name="eventTime"
                                                            type="time"
                                                            value={formData.eventTime}
                                                            onChange={handleInputChange}
                                                            className={formErrors.eventTime ? 'border-red-500' : ''}
                                                        />
                                                        {formErrors.eventTime && (
                                                            <p className="text-sm text-red-500">{formErrors.eventTime}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="location">Location</Label>
                                                    <Input
                                                        id="location"
                                                        name="location"
                                                        type="text"
                                                        placeholder="Enter event location"
                                                        value={formData.location}
                                                        onChange={handleInputChange}
                                                        className={formErrors.location ? 'border-red-500' : ''}
                                                    />
                                                    {formErrors.location && (
                                                        <p className="text-sm text-red-500">{formErrors.location}</p>
                                                    )}
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="description">Description</Label>
                                                    <Input
                                                        id="description"
                                                        name="description"
                                                        type="text"
                                                        placeholder="Enter event description"
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        className={formErrors.description ? 'border-red-500' : ''}
                                                    />
                                                    {formErrors.description && (
                                                        <p className="text-sm text-red-500">{formErrors.description}</p>
                                                    )}
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Contact Email</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="contact@example.com"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className={formErrors.email ? 'border-red-500' : ''}
                                                    />
                                                    {formErrors.email && (
                                                        <p className="text-sm text-red-500">{formErrors.email}</p>
                                                    )}
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="eventThumbnailImage">Event Thumbnail Image</Label>
                                                    <Input
                                                        id="eventThumbnailImage"
                                                        name="eventThumbnailImage"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className={formErrors.eventThumbnailImage ? 'border-red-500' : ''}
                                                    />
                                                    {formErrors.eventThumbnailImage && (
                                                        <p className="text-sm text-red-500">{formErrors.eventThumbnailImage}</p>
                                                    )}
                                                    {imagePreview && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="w-full h-32 object-cover rounded-md border"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center space-x-2 py-2">
                                                    <input
                                                        type="checkbox"
                                                        id="isFreeEvent"
                                                        name="isFreeEvent"
                                                        checked={formData.isFreeEvent}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <Label htmlFor="isFreeEvent" className="text-sm font-medium">
                                                        This is a free event
                                                    </Label>
                                                </div>

                                                {!formData.isFreeEvent && (
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="price">Price ($)</Label>
                                                        <Input
                                                            id="price"
                                                            name="price"
                                                            type="number"
                                                            placeholder="0.00"
                                                            min="0"
                                                            step="0.01"
                                                            value={formData.price}
                                                            onChange={handleInputChange}
                                                            className={formErrors.price ? 'border-red-500' : ''}
                                                        />
                                                        {formErrors.price && (
                                                            <p className="text-sm text-red-500">{formErrors.price}</p>
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="w-full sm:w-auto"
                                                    disabled={isSubmitting}
                                                >
                                                    Cancel
                                                </Button>
                                            </DialogClose>

                                            <Button
                                                onClick={handleAddEvent}
                                                disabled={isSubmitting}
                                                className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                        Adding Event...
                                                    </>
                                                ) : (
                                                    'Add Event'
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Events List */}
                        <div className="space-y-6">
                            {isLoading && (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                    <span className="ml-2">Loading events...</span>
                                </div>
                            )}

                            {error && (
                                <div className="text-center py-12 text-red-500">
                                    <p>Error loading events: {error}</p>
                                    <Button
                                        onClick={() => fetchEvents(filters)}
                                        className="mt-4"
                                        variant="outline"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            {!isLoading && !error && events.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Calendar className="mx-auto h-16 w-16 mb-4 text-gray-300" />
                                    <h3 className="text-lg font-medium">No events found</h3>
                                    <p>Try adjusting your search or filters, or add a new event.</p>
                                </div>
                            )}

                            {!isLoading && !error && events.length > 0 && (
                                <>
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {events.map((event) => (
                                            <div key={event._id} className="bg-background text-foreground rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
                                                <div className="relative">
                                                    {imageLoadingStates[event._id] && !imageErrors[event._id] && (
                                                        <div className="w-full h-48">
                                                            <Skeleton className="w-full h-48" />
                                                        </div>
                                                    )}

                                                    {imageErrors[event._id] ? (
                                                        <div className="w-full h-48 flex items-center justify-center">
                                                            <div className="text-center">
                                                                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                                                <p className="text-sm text-muted-foreground">Image not available</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={event.eventThumbnailImage}
                                                            alt={event.eventName}
                                                            className={`w-full h-48 object-cover ${imageLoadingStates[event._id] ? 'hidden' : 'block'}`}
                                                            onLoad={() => handleImageLoad(event._id)}
                                                            onError={() => handleImageError(event._id)}
                                                        />
                                                    )}

                                                    <div className="absolute top-3 right-3">
                                                        {event.isFreeEvent ? (
                                                            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                                FREE
                                                            </span>
                                                        ) : (
                                                            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                                ${event.price}
                                                            </span>
                                                        )}
                                                    </div>
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
                                                        <div className="flex justify-between">
                                                            <div className="flex items-center">
                                                                <MapPin className="h-4 w-4 mr-2" />
                                                                <span className="line-clamp-1">{event.location}</span>
                                                            </div>

                                                            <div>
                                                                {!event.isFreeEvent && (
                                                                    <div className="flex items-center">
                                                                        {/* <DollarSign className="h-4 w-4 mr-2" /> */}
                                                                        <span>RS.{event.price}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex-1"
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                                                onClick={() => handleDeleteClick(event._id, event.eventName)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {pagination.totalPages > 1 && (
                                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 border rounded-lg">
                                            <div className="flex flex-1 justify-between sm:hidden">
                                                <Button
                                                    onClick={() => goToPage(pagination.currentPage - 1)}
                                                    disabled={!pagination.hasPrevPage || isLoading}
                                                    variant="outline"
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    onClick={() => goToPage(pagination.currentPage + 1)}
                                                    disabled={!pagination.hasNextPage || isLoading}
                                                    variant="outline"
                                                >
                                                    Next
                                                </Button>
                                            </div>

                                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalEvents} total events)
                                                    </p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        onClick={() => goToPage(pagination.currentPage - 1)}
                                                        disabled={!pagination.hasPrevPage || isLoading}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Previous
                                                    </Button>
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
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteConfirmation.isOpen} onOpenChange={(open) => !open && handleDeleteCancel()}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Delete Event</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-sm text-muted-foreground">
                                Are you sure you want to delete the event <strong>"{deleteConfirmation.eventName}"</strong>?
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                This action cannot be undone.
                            </p>
                        </div>
                        <DialogFooter className="flex gap-2 sm:gap-2">
                            <Button
                                variant="outline"
                                onClick={handleDeleteCancel}
                                disabled={deleteConfirmation.isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteConfirm}
                                disabled={deleteConfirmation.isDeleting}
                            >
                                {deleteConfirmation.isDeleting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Event
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    )
}

export default AddEvents