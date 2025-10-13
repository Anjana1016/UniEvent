import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div className="p-4 border-t border-border text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} UniEvent. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer