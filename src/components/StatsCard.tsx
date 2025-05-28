import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, change, color }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={cn("p-3 rounded-md", color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <span className={cn(
          "text-sm font-medium",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  );
};

export default StatsCard;