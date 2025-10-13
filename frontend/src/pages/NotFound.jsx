import { Button } from '@/components/ui/button'
import React from 'react'

const NotFound = () => {
    return (
        <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
            <div className="text-center px-4 max-w-4xl animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                    <span className="text-blue-500 animate-pulse">404 Not Found</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-muted-foreground animate-slide-up animation-delay-200">
                    The page you are looking for does not exist.
                </p>

                <Button
                    className=" bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition animate-slide-up animation-delay-400"
                    onClick={() => window.history.back()}
                >
                    Go back
                </Button>
            </div>
        </section>
    )
}

export default NotFound