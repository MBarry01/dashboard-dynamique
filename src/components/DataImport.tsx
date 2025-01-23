import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, Upload, Table } from 'lucide-react';
import { read, utils } from 'xlsx';
import { Card } from '@tremor/react';

interface Props {
  onDataImport: (data: any[]) => void;
}

export const DataImport: React.FC<Props> = ({ onDataImport }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json(worksheet);
        onDataImport(jsonData);
      };
      reader.readAsBinaryString(file);
    });
  }, [onDataImport]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    }
  });

  return (
    <Card className="mt-8">
      <div className="text-center mb-8">
        <Table className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Importez vos données
        </h2>
        <p className="text-gray-500">
          Glissez-déposez vos fichiers Excel ou CSV pour commencer à créer vos visualisations
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`
          p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
        {isDragActive ? (
          <p className="text-lg text-indigo-600 font-medium">
            Déposez vos fichiers ici...
          </p>
        ) : (
          <div>
            <p className="text-lg mb-2 text-gray-700">
              Glissez-déposez vos fichiers ici
            </p>
            <p className="text-sm text-gray-500 mb-4">ou</p>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Upload className="w-4 h-4 mr-2" />
              Sélectionnez des fichiers
            </button>
            <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                Excel (.xlsx, .xls)
              </span>
              <span className="flex items-center">
                <Table className="w-4 h-4 mr-1" />
                CSV (.csv)
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};