import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    UserCheck,
    Settings,
    FileText,
    BarChart3,
    Calendar,
    MessageSquare,
    Shield,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useAdminAuthStore } from '@/stores/adminAuthStore'

const AdminSideBar = ({ isCollapsed = false, onToggle }) => {

    const location = useLocation()
    const { admin } = useAdminAuthStore();

    const navigationItems = [
        {
            title: "Dashboard",
            href: admin ? `/admin/${admin._id}/${encodeURIComponent(admin.email)}` : "/admin/dashboard",
            icon: LayoutDashboard,
            badge: null
        },
        {
            title: "Events",
            href: admin ? `/admin/${admin._id}/${encodeURIComponent(admin.email)}/events` : "/admin/events",
            icon: FileText,
            badge: null
        },
        {
            title: "Users",
            href: "/admin/users",
            icon: Users,
            badge: "142"
        },
        // {
        //     title: "Analytics",
        //     href: "/admin/analytics",
        //     icon: BarChart3,
        //     badge: null
        // },
        {
            title: "Calendar",
            href: "/admin/calendar",
            icon: Calendar,
            badge: null
        },
        {
            title: "Messages",
            href: "/admin/messages",
            icon: MessageSquare,
            badge: "3"
        }
    ]

    const settingsItems = [
        {
            title: "Security",
            href: "/admin/security",
            icon: Shield,
            badge: null
        },
        {
            title: "Settings",
            href: "/admin/settings",
            icon: Settings,
            badge: null
        }
    ]

    const isActiveRoute = (href) => {
        // Check if admin exists before accessing its properties
        if (!admin || !admin._id || !admin.email) {
            return false
        }
        
        // For exact matching of dashboard route
        if (href === `/admin/${admin._id}/${encodeURIComponent(admin.email)}`) {
            return location.pathname === href
        }
        // For other routes, use the original logic
        return location.pathname === href || location.pathname.startsWith(href + '/')
    }

    // Don't render sidebar if admin data is not loaded
    if (!admin) {
        return null
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
                <div className="p-4 space-y-2">
                    {/* Main Navigation */}
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

            {/* Footer */}
            {!isCollapsed && (
                <div className="p-4 border-t">
                    <div className="rounded-lg bg-muted p-3">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-muted-foreground">System Status</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All systems operational
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminSideBar;