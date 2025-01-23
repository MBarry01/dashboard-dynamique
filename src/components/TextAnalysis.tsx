import React, { useMemo } from 'react';
import { Card, Title, Select, SelectItem } from '@tremor/react';
import { BarList } from '@tremor/react';
import type { DataSource } from '../types';

interface Props {
  data: any[];
  dataSource: DataSource;
  selectedColumn?: string;
  onColumnSelect: (column: string) => void;
}

export const TextAnalysis: React.FC<Props> = ({
  data,
  dataSource,
  selectedColumn,
  onColumnSelect
}) => {
  const textColumns = useMemo(() => {
    return dataSource.columns.filter(column => {
      const sample = data[0]?.[column];
      return typeof sample === 'string' && sample.length > 0;
    });
  }, [data, dataSource.columns]);

  const analysis = useMemo(() => {
    if (!selectedColumn || !data.length) return null;

    // Analyse de fréquence des mots
    const wordFrequency: Record<string, number> = {};
    data.forEach(row => {
      const text = String(row[selectedColumn]).toLowerCase();
      const words = text.split(/\s+/).filter(word => word.length > 2);
      words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    });

    // Convertir en format pour BarList et trier par fréquence
    return Object.entries(wordFrequency)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [data, selectedColumn]);

  if (!textColumns.length) {
    return (
      <Card className="mt-4">
        <Title>Analyse de Texte</Title>
        <p className="text-gray-500 mt-2">
          Aucune colonne de texte disponible dans les données.
        </p>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <Title>Analyse de Texte</Title>
        <Select
          value={selectedColumn}
          onValueChange={onColumnSelect}
          placeholder="Sélectionner une colonne"
        >
          {textColumns.map(column => (
            <SelectItem key={column} value={column}>
              {column}
            </SelectItem>
          ))}
        </Select>
      </div>

      {analysis && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Fréquence des mots - Top 10
          </h3>
          <BarList data={analysis} className="mt-2" />
        </div>
      )}
    </Card>
  );
};