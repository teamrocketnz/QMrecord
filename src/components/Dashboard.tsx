import React from 'react';
import { Part } from '../types';
import { Package, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  parts: Part[];
}

export function Dashboard({ parts }: DashboardProps) {
  const totalParts = parts.length;
  const sapPlaced = parts.filter(p => p.sapPlaced).length;
  const sapReleased = parts.filter(p => p.sapReleased).length;
  const qualityIssues = parts.filter(p => p.qualityStatus === 'fail' || p.qualityStatus === 'hold').length;

  const stats = [
    {
      label: 'Total Parts',
      value: totalParts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'SAP Placed',
      value: sapPlaced,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'SAP Released',
      value: sapReleased,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Quality Issues',
      value: qualityIssues,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}