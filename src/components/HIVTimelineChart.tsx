import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts';
import { Card, Title, Select, SelectItem } from '@tremor/react';
import type { HIVData, FilterState } from '../types';

interface Props {
  data: HIVData[];
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

export const HIVTimelineChart: React.FC<Props> = ({ data, filters, onFilterChange }) => {
  return (
    <Card className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <Title>People Living with HIV Timeline</Title>
        <div className="flex space-x-4">
          <Select
            value={filters.region}
            onValueChange={(value) => onFilterChange('region', value)}
          >
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="africa">Africa</SelectItem>
            <SelectItem value="americas">Americas</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="seasia">South-East Asia</SelectItem>
            <SelectItem value="wpacific">Western Pacific</SelectItem>
          </Select>
          <Select
            value={filters.displayMode}
            onValueChange={(value) => onFilterChange('displayMode', value as 'absolute' | 'perCapita')}
          >
            <SelectItem value="absolute">Absolute Numbers</SelectItem>
            <SelectItem value="perCapita">Per Capita</SelectItem>
          </Select>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="peopleWithHIV"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            {filters.showConfidenceIntervals && (
              <Area
                type="monotone"
                dataKey="peopleWithHIVMin"
                stroke="none"
                fill="#ef4444"
                fillOpacity={0.1}
              />
            )}
            {filters.showConfidenceIntervals && (
              <Area
                type="monotone"
                dataKey="peopleWithHIVMax"
                stroke="none"
                fill="#ef4444"
                fillOpacity={0.1}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};