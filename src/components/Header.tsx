import React from 'react';
import { LayoutDashboard, Upload, Settings, PlusCircle } from 'lucide-react';

interface Props {
  onImportClick: () => void;
  onNewWidgetClick: () => void;
}

export const Header: React.FC<Props> = ({ onImportClick, onNewWidgetClick }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LayoutDashboard className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Dynamique</h1>
              <p className="text-sm text-gray-500">Visualisez et analysez vos données</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onImportClick}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importer des données
            </button>
            <button 
              onClick={onNewWidgetClick}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouveau widget
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};