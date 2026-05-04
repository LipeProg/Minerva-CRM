import React from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
}

function getCellValue<T>(row: T, key: keyof T | string): unknown {
  if (typeof key !== 'string') {
    return row[key];
  }

  return key.split('.').reduce<unknown>((currentValue, keyPart) => {
    if (currentValue && typeof currentValue === 'object' && keyPart in currentValue) {
      return (currentValue as Record<string, unknown>)[keyPart];
    }

    return undefined;
  }, row);
}

function Table<T>({ columns, data, getRowKey, onRowClick }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${column.className ?? ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, rowIndex) => (
            <tr
              key={getRowKey?.(row, rowIndex) ?? rowIndex}
              className={`${onRowClick ? 'cursor-pointer' : ''} transition-colors hover:bg-slate-50`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => {
                const value = getCellValue(row, column.key);

                return (
                  <td
                    key={`${rowIndex}-${String(column.key)}`}
                    className={`px-4 py-4 text-sm text-slate-700 ${column.className ?? ''}`}
                  >
                    {column.render ? column.render(value, row) : String(value ?? '')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-8 text-center text-sm text-slate-500">
          Nenhum registro encontrado
        </div>
      )}
    </div>
  );
}

export default Table;
