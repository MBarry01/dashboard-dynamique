import React, { useState } from 'react';
import { Header } from './components/Header';
import { DataImport } from './components/DataImport';
import { WidgetGrid } from './components/WidgetGrid';
import { TextAnalysisCanvas } from './components/TextAnalysisCanvas';
import type { Widget, DataSource } from './types';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showImport, setShowImport] = useState(true);

  const handleDataImport = (data: any[]) => {
    const newDataSource: DataSource = {
      id: `ds-${Date.now()}`,
      name: 'Nouveau jeu de données',
      type: 'excel',
      lastUpdate: new Date(),
      columns: Object.keys(data[0] || {}),
      data
    };

    setDataSources(prev => [...prev, newDataSource]);
    setShowImport(false);
    
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: 'line',
      library: 'recharts',
      title: 'Nouveau graphique',
      dataSourceId: newDataSource.id,
      config: {
        xAxis: newDataSource.columns[0],
        series: [newDataSource.columns[1]],
        chartSpecificConfig: {}
      },
      position: { x: 0, y: 0, w: 12, h: 4 }
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const handleWidgetUpdate = (updatedWidget: Widget) => {
    setWidgets(prev =>
      prev.map(widget =>
        widget.id === updatedWidget.id ? updatedWidget : widget
      )
    );
  };

  const handleWidgetDelete = (widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
  };

  const handleWidgetDuplicate = (widget: Widget) => {
    const newWidget = {
      ...widget,
      id: `widget-${Date.now()}`,
      title: `${widget.title} (copie)`,
      position: { ...widget.position, y: widget.position.y + 4 }
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const handleLayoutChange = (layout: any) => {
    setWidgets(prev =>
      prev.map(widget => {
        const layoutItem = layout.find((item: any) => item.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            position: {
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h
            }
          };
        }
        return widget;
      })
    );
  };

  const addNewWidget = () => {
    if (dataSources.length === 0) {
      setShowImport(true);
      return;
    }

    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: 'line',
      library: 'recharts',
      title: 'Nouveau graphique',
      dataSourceId: dataSources[0].id,
      config: {
        xAxis: dataSources[0].columns[0],
        series: [dataSources[0].columns[1]],
        chartSpecificConfig: {}
      },
      position: { x: 0, y: widgets.length * 4, w: 12, h: 4 }
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onImportClick={() => setShowImport(true)} 
        onNewWidgetClick={addNewWidget}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {showImport ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DataImport onDataImport={handleDataImport} />
              <TextAnalysisCanvas />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <WidgetGrid
                widgets={widgets}
                dataSources={dataSources}
                onWidgetUpdate={handleWidgetUpdate}
                onWidgetDelete={handleWidgetDelete}
                onWidgetDuplicate={handleWidgetDuplicate}
                onLayoutChange={handleLayoutChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}