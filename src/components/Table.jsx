import React from 'react';

const Table = ({ columns, data, loading, emptyMessage = "No data available" }) => {
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white rounded-xl border border-slate-200">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto card">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-50 transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 text-sm text-slate-700">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 italic">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
