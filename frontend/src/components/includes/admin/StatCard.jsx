import React from 'react';

const StatCard = ({ title, value, icon, trend, trendValue }) => {
    const renderIcon = () => {
        if (React.isValidElement(icon)) {
            // It's a React component (like Lucide icons)
            return React.cloneElement(icon, { 
                className: "text-white",
                size: 20 
            });
        } else {
            // It's a string (emoji)
            return (
                <span className="bg-blue-600 text-white text-xl">
                    {icon}
                </span>
            );
        }
    };

    return (
        <div className="bg-background text-muted-foreground rounded-lg shadow-md p-6 border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-white">
                        {value || 0}
                    </p>
                    {trend && trendValue && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                                {trend === 'up' && '↗'} 
                                {trend === 'down' && '↘'} 
                                {trend === 'neutral' && '→'} 
                                {trendValue}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">this month</span>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg">
                        {renderIcon()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;