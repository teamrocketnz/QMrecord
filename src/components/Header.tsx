import React from 'react';
import { Package, Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QM Parts Tracker</h1>
              <p className="text-sm text-gray-600">Quality Management System</p>
            </div>
          </div>
          
          <button
            onClick={onSettingsClick}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Field Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}