import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, Title } from '@tremor/react';
import type { HIVData } from '../types';

interface Props {
  data: HIVData[];
}

export const ARTCoverageDashboard: React.FC<Props> = ({ data }) => {
  return (
    <Card className="mt-4">
      <Title>ART Coverage Dashboard</Title>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="peopleWithHIV"
              fill="#ef4444"
              name="People with HIV"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="artCoverage"
              stroke="#22c55e"
              name="ART Coverage %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};