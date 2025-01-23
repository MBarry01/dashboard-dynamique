export interface DataSource {
  id: string;
  name: string;
  type: 'csv' | 'excel' | 'sheets';
  lastUpdate: Date;
  columns: string[];
  data: any[];
}

export interface Widget {
  id: string;
  type: 'line' | 'area' | 'bar' | 'pie';
  library: 'recharts' | 'plotly';
  title: string;
  dataSourceId: string;
  config: {
    xAxis?: string;
    yAxis?: string;
    series?: string[];
    aggregation?: 'sum' | 'average' | 'count';
    chartSpecificConfig?: any;
  };
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface Filter {
  column: string;
  operator: 'equals' | 'contains' | 'greater' | 'less';
  value: string | number;
}