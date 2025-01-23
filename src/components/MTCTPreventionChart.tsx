import React from 'react';
import {
  BarChart,
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

export const MTCTPreventionChart: React.FC<Props> = ({ data }) => {
  return (
    <Card className="mt-4">
      <Title>Mother-to-Child Transmission Prevention</Title>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="pregnantWomenNeeding"
              stackId="a"
              fill="#ef4444"
              name="Women Needing ARV"
            />
            <Bar
              dataKey="pregnantWomenReceiving"
              stackId="a"
              fill="#22c55e"
              name="Women Receiving ARV"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};