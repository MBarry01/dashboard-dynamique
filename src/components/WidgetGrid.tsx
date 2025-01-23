import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Widget, DataSource } from '../types';
import { ChartWidget } from './ChartWidget';
import { motion } from 'framer-motion';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Props {
  widgets: Widget[];
  onWidgetUpdate: (widget: Widget) => void;
  onWidgetDelete?: (widgetId: string) => void;
  onWidgetDuplicate?: (widget: Widget) => void;
  onLayoutChange: (layout: any) => void;
  dataSources: DataSource[];
}

export const WidgetGrid: React.FC<Props> = ({ 
  widgets, 
  onWidgetUpdate, 
  onWidgetDelete,
  onWidgetDuplicate,
  onLayoutChange, 
  dataSources 
}) => {
  const layouts = {
    lg: widgets.map(widget => ({
      i: widget.id,
      x: widget.position.x,
      y: widget.position.y,
      w: widget.position.w,
      h: widget.position.h,
      minW: 3,
      minH: 3
    }))
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={100}
      onLayoutChange={(layout) => onLayoutChange(layout)}
      isDraggable
      isResizable
      margin={[16, 16]}
    >
      {widgets.map(widget => {
        const dataSource = dataSources.find(ds => ds.id === widget.dataSourceId);
        return (
          <motion.div
            key={widget.id}
            className="bg-white rounded-lg shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ChartWidget
              widget={widget}
              onUpdate={onWidgetUpdate}
              onDelete={onWidgetDelete}
              onDuplicate={onWidgetDuplicate}
              data={dataSource?.data || []}
            />
          </motion.div>
        );
      })}
    </ResponsiveGridLayout>
  );
};