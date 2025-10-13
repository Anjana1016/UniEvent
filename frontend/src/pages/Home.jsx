import Footer from '@/components/includes/Footer'
import Header from '@/components/includes/Header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import React, { useEffect, useState } from 'react'

const Home = () => {

    useEffect(() => {
        document.title = "UniEvent"
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors">
            <Header />

            {/* Main content */}
            <main className="p-8 pt-14">
                <div className="max-w-6xl mx-auto space-y-6 flex space-x-6">

                    <div className=' w-1/2 space-y-6'>
                        <div className=' space-y-2'>
                            <Badge className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-blue-500">
                                Rajarata University of Sri Lanka
                            </Badge>
                            <h1 className="text-5xl font-bold text-primary">
                                Find upcoming University <span className=' text-blue-500'>Events</span>
                            </h1>
                        </div>
                        <div className="p-6 border border-border rounded-lg bg-card">
                            <p className="text-muted-foreground">
                                Rajarata UniEvent is a digital platform designed to manage and promote university events, make it easy for students and organizers to connect
                                and participate in campus activities.
                                <br />
                                It allows organizers to create and share events while students can easily register and stay updated.
                                With features like event calendars and reminders, it keeps the entire campus community connected and engaged.
                            </p>
                        </div>

                        <div className=' justify-between items-center flex'>
                            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <Avatar>
                                    <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
                                    <AvatarFallback>LR</AvatarFallback>
                                </Avatar>
                                <Avatar>
                                    <AvatarImage
                                        src="https://github.com/evilrabbit.png"
                                        alt="@evilrabbit"
                                    />
                                    <AvatarFallback>ER</AvatarFallback>
                                </Avatar>
                                <Avatar>
                                    <AvatarFallback
                                        className=" bg-blue-600 text-white"
                                    >
                                        +80
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className=' text-muted-foreground'>
                                <span className=' text-white'>50+</span> Events hosted last year
                            </div>
                        </div>

                    </div>

                    <div className=' w-1/2'>
                        <div className=' rounded-lg overflow-hidden border border-border'>
                            <img
                                src="/rajarata.png"
                                alt="Rajarata University"
                                className="w-full h-[650px] md:h-[500px] lg:h-[440px] object-cover transition-all duration-300"
                            />
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Home