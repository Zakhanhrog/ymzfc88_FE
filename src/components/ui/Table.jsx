const Table = ({ 
  columns = [],
  dataSource = [],
  loading = false,
  rowKey = 'id',
  onRow,
  className = '',
  emptyText = 'Không có dữ liệu',
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-[#D30102] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dataSource || dataSource.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || column.dataIndex || index}
                className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${column.className || ''}`}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dataSource.map((record, recordIndex) => {
            const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey] || recordIndex;
            const rowProps = onRow ? onRow(record, recordIndex) : {};
            
            return (
              <tr 
                key={key}
                className="hover:bg-gray-50 transition-colors"
                {...rowProps}
              >
                {columns.map((column, columnIndex) => {
                  const value = record[column.dataIndex];
                  const content = column.render 
                    ? column.render(value, record, recordIndex)
                    : value;
                  
                  return (
                    <td
                      key={column.key || column.dataIndex || columnIndex}
                      className={`px-6 py-4 text-sm text-gray-900 ${column.className || ''}`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

