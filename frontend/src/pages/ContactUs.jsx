import Footer from '@/components/includes/Footer'
import Header from '@/components/includes/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { 
    Mail, 
    Phone, 
    MapPin, 
    Clock, 
    Send, 
    MessageSquare,
    Building,
    Users
} from 'lucide-react'

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        document.title = "Contact Us - UniEvent"
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        
        // Simulate form submission
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors">
            <Header />

            {/* Main content */}
            <main className="p-8 pt-14">
                <div className="max-w-6xl mx-auto space-y-8">
                    
                    {/* Hero Section */}
                    <div className="text-center space-y-4">
                        <Badge className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-blue-500">
                            Get In Touch
                        </Badge>
                        <h1 className="text-5xl font-bold text-primary">
                            Contact <span className="text-blue-500">Us</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Have questions about UniEvent? Need help organizing an event? We're here to help! 
                            Reach out to our team and we'll get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Contact Form */}
                        <div className="space-y-6">
                            <div className="p-6 border border-border rounded-lg bg-card space-y-6">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-blue-500" />
                                    <h2 className="text-2xl font-semibold">Send us a message</h2>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Your full name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="your.email@example.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            placeholder="What's this about?"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                            value={formData.message}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>Sending...</>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            
                            {/* Contact Details */}
                            <div className="p-6 border border-border rounded-lg bg-card space-y-4">
                                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Building className="h-5 w-5 text-blue-500 mt-1" />
                                        <div>
                                            <p className="font-medium">University Office</p>
                                            <p className="text-sm text-muted-foreground">
                                                Rajarata University of Sri Lanka<br />
                                                Mihintale, Sri Lanka
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-blue-500 mt-1" />
                                        <div>
                                            <p className="font-medium">Email Address</p>
                                            <p className="text-sm text-muted-foreground">
                                                events@rjt.ac.lk<br />
                                                info@unievents.rjt.ac.lk
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-blue-500 mt-1" />
                                        <div>
                                            <p className="font-medium">Phone Number</p>
                                            <p className="text-sm text-muted-foreground">
                                                +94 25 266 6000<br />
                                                +94 25 266 6001
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-blue-500 mt-1" />
                                        <div>
                                            <p className="font-medium">Office Hours</p>
                                            <p className="text-sm text-muted-foreground">
                                                Monday - Friday: 8:00 AM - 5:00 PM<br />
                                                Saturday: 8:00 AM - 12:00 PM<br />
                                                Sunday: Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Event Support */}
                            <div className="p-6 border border-border rounded-lg bg-card space-y-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    <h3 className="text-xl font-semibold">Event Support</h3>
                                </div>
                                
                                <div className="space-y-3">
                                    <div>
                                        <p className="font-medium text-sm">Technical Support</p>
                                        <p className="text-sm text-muted-foreground">
                                            Having trouble with the platform? Our tech team is here to help.
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <p className="font-medium text-sm">Event Planning</p>
                                        <p className="text-sm text-muted-foreground">
                                            Need assistance organizing your university event? We'll guide you through the process.
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <p className="font-medium text-sm">Partnership Opportunities</p>
                                        <p className="text-sm text-muted-foreground">
                                            Interested in partnering with us for larger events or initiatives.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="p-6 border border-border rounded-lg bg-card">
                                <h3 className="text-xl font-semibold mb-4">Why Contact Us?</h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-blue-500">50+</p>
                                        <p className="text-sm text-muted-foreground">Events Organized</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-500">1000+</p>
                                        <p className="text-sm text-muted-foreground">Students Reached</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-500">24/7</p>
                                        <p className="text-sm text-muted-foreground">Platform Available</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-500">&lt;24h</p>
                                        <p className="text-sm text-muted-foreground">Response Time</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="p-6 border border-border rounded-lg bg-card space-y-4">
                        <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-medium">How do I create an event?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Sign up for an account, log in, and navigate to your dashboard. Click "Add Event" to start creating your event with all the necessary details.
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <h4 className="font-medium">Is the platform free to use?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Yes! UniEvent is completely free for all university students, staff, and organizations to use for managing their events.
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <h4 className="font-medium">Can I edit my event after publishing?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Absolutely! You can edit your event details anytime from your dashboard. Registered participants will be notified of any major changes.
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <h4 className="font-medium">How do I register for events?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Browse events on the "Find Events" page, click on any event you're interested in, and follow the registration instructions provided.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}

export default ContactUs