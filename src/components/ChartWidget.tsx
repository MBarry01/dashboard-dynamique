import React, { useState } from 'react';
import { Card, Title, Select, SelectItem, Button, Badge } from '@tremor/react';
import { Settings, Edit3, Copy, Trash2 } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);
import type { Widget } from '../types';

interface Props {
  widget: Widget;
  onUpdate: (widget: Widget) => void;
  onDelete?: (widgetId: string) => void;
  onDuplicate?: (widget: Widget) => void;
  data: any[];
}

const CHART_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#6366f1', '#ec4899', '#8b5cf6', '#14b8a6'
];

const CHART_TYPES = [
  { value: 'line', label: 'Ligne' },
  { value: 'area', label: 'Aire' },
  { value: 'bar', label: 'Barres' },
  { value: 'pie', label: 'Camembert' }
] as const;

export const ChartWidget: React.FC<Props> = ({ 
  widget, 
  onUpdate, 
  onDelete,
  onDuplicate,
  data 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(widget.title);

  const handleTitleUpdate = () => {
    onUpdate({ ...widget, title });
    setIsEditingTitle(false);
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
          <div className="mb-2">Aucune donnée disponible</div>
          <Button 
            size="xs" 
            variant="secondary"
            onClick={() => setShowSettings(true)}
          >
            Configurer le graphique
          </Button>
        </div>
      );
    }

    if (widget.type === 'pie') {
      const pieData = data.map(item => ({
        label: String(item[widget.config.xAxis || '']),
        value: Number(item[widget.config.series?.[0] || '']) || 0
      }));

      return (
        <Plot
          data={[{
            type: 'pie',
            values: pieData.map(d => d.value),
            labels: pieData.map(d => d.label),
            hole: 0.4,
            marker: {
              colors: CHART_COLORS
            },
            textinfo: 'label+percent',
            hoverinfo: 'label+value+percent',
            textposition: 'outside',
            automargin: true
          }]}
          layout={{
            showlegend: true,
            legend: {
              orientation: 'h',
              yanchor: 'bottom',
              y: -0.2,
              xanchor: 'center',
              x: 0.5
            },
            margin: { t: 30, l: 30, r: 30, b: 0 },
            height: 300,
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent'
          }}
          config={{
            displayModeBar: false,
            responsive: true
          }}
          style={{ width: '100%', height: '300px' }}
        />
      );
    }

    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (widget.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={widget.config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              {widget.config.series?.map((serie, index) => (
                <Line
                  key={serie}
                  type="monotone"
                  dataKey={serie}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={widget.config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              {widget.config.series?.map((serie, index) => (
                <Area
                  key={serie}
                  type="monotone"
                  dataKey={serie}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  fillOpacity={0.3}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={widget.config.xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              {widget.config.series?.map((serie, index) => (
                <Bar
                  key={serie}
                  dataKey={serie}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return <div>Type de graphique non supporté</div>;
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {isEditingTitle ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-2 py-1 border rounded-md"
                autoFocus
                onBlur={handleTitleUpdate}
                onKeyPress={(e) => e.key === 'Enter' && handleTitleUpdate()}
              />
            </div>
          ) : (
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setIsEditingTitle(true)}
            >
              <Title>{widget.title}</Title>
              <Edit3 className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <Badge color="gray">{CHART_TYPES.find(t => t.value === widget.type)?.label}</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            value={widget.type}
            onValueChange={(value) => onUpdate({ ...widget, type: value as Widget['type'] })}
          >
            {CHART_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </Select>

          <div className="flex items-center space-x-1">
            <Button
              size="xs"
              variant="secondary"
              icon={Settings}
              onClick={() => setShowSettings(!showSettings)}
            >
              Options
            </Button>
            
            {onDuplicate && (
              <Button
                size="xs"
                variant="secondary"
                icon={Copy}
                onClick={() => onDuplicate(widget)}
              >
                Dupliquer
              </Button>
            )}

            {onDelete && (
              <Button
                size="xs"
                variant="secondary"
                color="red"
                icon={Trash2}
                onClick={() => onDelete(widget.id)}
              >
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </div>

      {renderChart()}

      {showSettings && (
        <div className="mt-4 p-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Axe X</label>
              <Select
                value={widget.config.xAxis}
                onValueChange={(value) => 
                  onUpdate({ 
                    ...widget, 
                    config: { ...widget.config, xAxis: value }
                  })
                }
              >
                {Object.keys(data[0] || {}).map(key => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Séries</label>
              <Select
                value={widget.config.series?.[0]}
                onValueChange={(value) =>
                  onUpdate({
                    ...widget,
                    config: { ...widget.config, series: [value] }
                  })
                }
              >
                {Object.keys(data[0] || {}).map(key => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};