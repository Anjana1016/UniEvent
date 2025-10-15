import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useUserAuthStore } from '@/stores/userAuthStore'
import { ChevronLeft, ChevronRight, LayoutDashboard, MessageSquare, Settings, House, Calendar, FileText, Info } from 'lucide-react'
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const UserSideBar = ({ isCollapsed = false, onToggle }) => {

    const location = useLocation()
    const { user } = useUserAuthStore();

    const navigationItems = [
        {
            title: "Dashboard",
            href: `/user/${user._id}/${encodeURIComponent(user.email)}`,
            icon: LayoutDashboard,
            badge: null
        },
        {
            title: "View Events",
            href: "/find-events",
            icon: FileText,
            badge: null
        },
        {
            title: "Get Help",
            href: `/user/${user._id}/${encodeURIComponent(user.email)}/help`,
            icon: Info,
            badge: null
        },
    ]

    const settingsItems = [
        {
            title: "Settings",
            href: `/user/${user._id}/${encodeURIComponent(user.email)}/settings`,
            icon: Settings,
            badge: null
        }
    ]

    const isActiveRoute = (href) => {
        // For exact matching of dashboard route, prevent matching upload/organize route
        if (href === `/user/${user._id}/${encodeURIComponent(user.email)}`) {
            return location.pathname === href
        }
        // For other routes, use the original logic
        return location.pathname === href || location.pathname.startsWith(href + '/')
    }

    return (
        <div className={cn(
            "flex flex-col h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300 sticky top-16",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Toggle Button - positioned relative to the sidebar */}
            <div className="relative">
                <div className="absolute -right-3 top-6 z-10">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-background border shadow-md"
                        onClick={onToggle}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-3 w-3" />
                        ) : (
                            <ChevronLeft className="h-3 w-3" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Navigation - Scrollable */}
            <ScrollArea className="flex-1">
                <div className=' p-4 space-y-2'>

                    <div className="space-y-1">
                        {navigationItems.map((item) => {
                            const isActive = isActiveRoute(item.href)
                            const Icon = item.icon

                            return (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                                        isActive
                                            ? "bg-accent text-accent-foreground font-medium"
                                            : "text-muted-foreground",
                                        isCollapsed && "justify-center px-2"
                                    )}
                                >
                                    <Icon className="h-4 w-4 flex-shrink-0" />
                                    {!isCollapsed && (
                                        <>
                                            <span className="flex-1">{item.title}</span>
                                            {item.badge && (
                                                <Badge className="ml-auto bg-blue-500 text-white hover:bg-blue-600">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            )
                        })}
                    </div>

                    {!isCollapsed && <Separator className="my-4" />}

                    {/* Settings Section */}
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <div className="px-3 py-2">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Settings
                                </h3>
                            </div>
                        )}
                        {settingsItems.map((item) => {
                            const isActive = isActiveRoute(item.href)
                            const Icon = item.icon

                            return (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                                        isActive
                                            ? "bg-accent text-accent-foreground font-medium"
                                            : "text-muted-foreground",
                                        isCollapsed && "justify-center px-2"
                                    )}
                                >
                                    <Icon className="h-4 w-4 flex-shrink-0" />
                                    {!isCollapsed && (
                                        <>
                                            <span className="flex-1">{item.title}</span>
                                            {item.badge && (
                                                <Badge variant="secondary" className="ml-auto">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            )
                        })}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

export default UserSideBar