import React from 'react';
import { Activity } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HIV/AIDS Global Dashboard</h1>
              <p className="text-sm text-gray-500">Comprehensive data visualization and analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Export Data
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
              Share Dashboard
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};