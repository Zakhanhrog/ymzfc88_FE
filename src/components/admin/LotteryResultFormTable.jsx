import React, { useState, useEffect } from 'react';

const LotteryResultFormTable = ({ 
  initialResults = null, 
  onResultsChange,
  isEditing = false,
  isReadOnly = false 
}) => {
  // Initialize với dữ liệu mặc định hoặc từ props
  const [results, setResults] = useState({
    'dac-biet': '',
    'giai-nhat': '',
    'giai-nhi': ['', ''],
    'giai-ba': ['', '', '', '', '', ''],
    'giai-tu': ['', '', '', ''],
    'giai-nam': ['', '', '', '', '', ''],
    'giai-sau': ['', '', ''],
    'giai-bay': ['', '', '', ''],
    'giai-tam': ['']
  });

  // Load initial data
  useEffect(() => {
    if (initialResults) {
      if (typeof initialResults === 'string') {
        try {
          const parsed = JSON.parse(initialResults);
          const newResults = { ...results };
          
          // Map parsed data to form structure
          Object.keys(parsed).forEach(key => {
            if (parsed[key] !== null && parsed[key] !== undefined) {
              if (Array.isArray(parsed[key])) {
                // Ensure array has correct length
                const expectedLength = getExpectedArrayLength(key);
                const array = [...parsed[key]];
                while (array.length < expectedLength) {
                  array.push('');
                }
                newResults[key] = array.slice(0, expectedLength);
              } else {
                newResults[key] = parsed[key].toString();
              }
            }
          });
          
          setResults(newResults);
        } catch (error) {
          console.error('Error parsing initial results:', error);
        }
      } else if (typeof initialResults === 'object') {
        const newResults = { ...results };
        Object.keys(initialResults).forEach(key => {
          if (initialResults[key] !== null && initialResults[key] !== undefined) {
            if (Array.isArray(initialResults[key])) {
              const expectedLength = getExpectedArrayLength(key);
              const array = [...initialResults[key]];
              while (array.length < expectedLength) {
                array.push('');
              }
              newResults[key] = array.slice(0, expectedLength);
            } else {
              newResults[key] = initialResults[key].toString();
            }
          }
        });
        setResults(newResults);
      }
    }
  }, [initialResults]);

  // Get expected array length for each prize
  const getExpectedArrayLength = (prizeKey) => {
    const lengths = {
      'giai-nhi': 2,
      'giai-ba': 6,
      'giai-tu': 4,
      'giai-nam': 6,
      'giai-sau': 3,
      'giai-bay': 4,
      'giai-tam': 1
    };
    return lengths[prizeKey] || 1;
  };

  // Handle number change
  const handleNumberChange = (prizeKey, index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setResults(prev => {
      const newResults = { ...prev };
      
      if (Array.isArray(newResults[prizeKey])) {
        newResults[prizeKey] = [...newResults[prizeKey]];
        newResults[prizeKey][index] = numericValue;
      } else {
        newResults[prizeKey] = numericValue;
      }
      
      // Convert to JSON format and notify parent
      const jsonResults = convertToJsonFormat(newResults);
      if (onResultsChange) {
        onResultsChange(jsonResults);
      }
      
      return newResults;
    });
  };

  // Convert form data to JSON format for API
  const convertToJsonFormat = (formData) => {
    const jsonData = {};
    
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      
      if (Array.isArray(value)) {
        // Filter out empty strings and convert to appropriate format
        const nonEmptyValues = value.filter(v => v && v.trim() !== '');
        if (nonEmptyValues.length > 0) {
          if (nonEmptyValues.length === 1) {
            jsonData[key] = nonEmptyValues[0];
          } else {
            jsonData[key] = nonEmptyValues;
          }
        }
      } else if (value && value.trim() !== '') {
        jsonData[key] = value;
      }
    });
    
    return JSON.stringify(jsonData);
  };

  // Prize configuration
  const prizes = [
    { key: 'dac-biet', label: 'Đặc biệt', color: 'text-red-600 font-bold', maxLength: 5, isArray: false },
    { key: 'giai-nhat', label: 'Giải nhất', color: 'text-black font-bold', maxLength: 5, isArray: false },
    { key: 'giai-nhi', label: 'Giải nhì', color: 'text-black font-bold', maxLength: 5, isArray: true, count: 2 },
    { key: 'giai-ba', label: 'Giải ba', color: 'text-black font-bold', maxLength: 5, isArray: true, count: 6 },
    { key: 'giai-tu', label: 'Giải tư', color: 'text-black font-bold', maxLength: 4, isArray: true, count: 4 },
    { key: 'giai-nam', label: 'Giải năm', color: 'text-black font-bold', maxLength: 4, isArray: true, count: 6 },
    { key: 'giai-sau', label: 'Giải sáu', color: 'text-black font-bold', maxLength: 3, isArray: true, count: 3 },
    { key: 'giai-bay', label: 'Giải bảy', color: 'text-black font-bold', maxLength: 2, isArray: true, count: 4 },
    { key: 'giai-tam', label: 'Giải tám', color: 'text-black font-bold', maxLength: 2, isArray: true, count: 1 }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
      <div className="bg-blue-50 px-4 py-2 border-b border-gray-300">
        <h3 className="text-sm font-medium text-gray-700">
          {isReadOnly ? 'Kết quả xổ số' : (isEditing ? 'Sửa kết quả xổ số' : 'Nhập kết quả xổ số')}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {isReadOnly ? 'Kết quả các giải thưởng' : 'Nhập số vào các ô tương ứng với từng giải thưởng'}
        </p>
      </div>
      
      <table className="w-full">
        <tbody>
          {prizes.map((prize) => {
            const prizeData = results[prize.key];
            
            return (
              <tr key={prize.key} className="border-b border-gray-200">
                <td className="w-24 px-3 py-3 bg-gray-50 border-r border-gray-300">
                  <span className={`text-sm font-medium ${prize.color}`}>
                    {prize.label}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    {prize.isArray ? (
                      // Array input (multiple numbers)
                      Array.from({ length: prize.count }, (_, index) => {
                        const number = prizeData[index] || '';
                        
                        return (
                          <input
                            key={index}
                            type="text"
                            value={number}
                            onChange={(e) => !isReadOnly && handleNumberChange(prize.key, index, e.target.value)}
                            maxLength={prize.maxLength}
                            placeholder={"0".repeat(prize.maxLength)}
                            disabled={isReadOnly}
                            className={`w-16 h-8 px-2 text-center border rounded text-sm font-bold ${
                              number 
                                ? 'border-gray-400 bg-white text-black' 
                                : 'border-gray-300 bg-gray-50 text-gray-400'
                            } ${!isReadOnly ? 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'cursor-not-allowed bg-gray-100'}`}
                          />
                        );
                      })
                    ) : (
                      // Single input
                      <input
                        type="text"
                        value={prizeData || ''}
                        onChange={(e) => !isReadOnly && handleNumberChange(prize.key, 0, e.target.value)}
                        maxLength={prize.maxLength}
                        placeholder={"0".repeat(prize.maxLength)}
                        disabled={isReadOnly}
                        className={`w-16 h-8 px-2 text-center border rounded text-sm font-bold ${
                          prizeData 
                            ? 'border-gray-400 bg-white text-black' 
                            : 'border-gray-300 bg-gray-50 text-gray-400'
                        } ${!isReadOnly ? 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'cursor-not-allowed bg-gray-100'}`}
                      />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {!isReadOnly && (
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-300">
          <div className="text-xs text-gray-600">
            <strong>Lưu ý:</strong> Chỉ nhập số, không cần nhập đầy đủ tất cả ô. Các ô trống sẽ không được lưu.
          </div>
        </div>
      )}
    </div>
  );
};

export default LotteryResultFormTable;
