import { useState } from 'react';
import { showNotification } from '../../../utils/notification';

/**
 * Hook quản lý việc chọn số
 * GIỮ NGUYÊN 100% logic từ MienBacGamePage.jsx
 */
export const useBetSelection = (selectedGameType) => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [numberInput, setNumberInput] = useState('');
  const [selectionMode, setSelectionMode] = useState('quick'); // 'quick' or 'input'

  // Logic chọn số nhanh (grid)
  const handleNumberSelect = (number) => {
    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      }
      return [...prev, number];
    });
  };

  // Parse và validate input
  const parseNumberInput = () => {
    // Xử lý loto xiên 2, 3, 4 (format: "12,23; 34,45")
    if (selectedGameType === 'loto-xien-2' || selectedGameType === 'loto-xien-3' || selectedGameType === 'loto-xien-4') {
      const groupSize = selectedGameType === 'loto-xien-2' ? 2 : selectedGameType === 'loto-xien-3' ? 3 : 4;
      
      const groups = numberInput.split(';').map(g => g.trim()).filter(g => g.length > 0);
      const validGroups = [];
      const invalidGroups = [];
      
      for (const group of groups) {
        const numbers = group.split(',').map(n => n.trim());
        
        if (numbers.length !== groupSize) {
          invalidGroups.push(group);
          continue;
        }
        
        const allValid = numbers.every(n => /^\d{2}$/.test(n) && parseInt(n) >= 0 && parseInt(n) <= 99);
        if (allValid) {
          const paddedNumbers = numbers.map(n => n.padStart(2, '0'));
          validGroups.push(paddedNumbers.join(','));
        } else {
          invalidGroups.push(group);
        }
      }
      
      if (invalidGroups.length > 0) {
        showNotification(`Cụm không hợp lệ: ${invalidGroups.join(', ')}`, 'error');
      }
      
      // Loại bỏ trùng lặp
      const existingGroups = selectedNumbers.filter(item => {
        const parts = item.split(',');
        return parts.length === groupSize;
      });
      
      const uniqueGroups = validGroups.filter(group => !existingGroups.includes(group));
      const duplicateGroups = validGroups.filter(group => existingGroups.includes(group));
      
      if (duplicateGroups.length > 0) {
        const duplicateText = duplicateGroups.map(group => {
          const nums = group.split(',');
          return `(${nums.join(', ')})`;
        }).join(', ');
        showNotification(`Các cụm số ${duplicateText} đã tồn tại!`, 'warning');
      }
      
      setSelectedNumbers([...existingGroups, ...uniqueGroups]);
      setNumberInput('');
      return;
    }

    // Logic cho loto thông thường (2s, 3s, 4s)
    const isLoto4s = selectedGameType === 'loto-4s' || selectedGameType === 'loto4s' || selectedGameType === '4s-dac-biet';
    const isLoto3s = selectedGameType === 'loto-3s' || selectedGameType === 'loto3s' || selectedGameType === '3s-giai-nhat' || selectedGameType === '3s-dac-biet';
    
    let numDigits = 2;
    let maxValue = 99;
    let regex = /^\d{2}$/;
    
    if (isLoto4s) {
      numDigits = 4;
      maxValue = 9999;
      regex = /^\d{4}$/;
    } else if (isLoto3s) {
      numDigits = 3;
      maxValue = 999;
      regex = /^\d{3}$/;
    }
    
    const inputNumbers = numberInput
      .split(/[,\s]+/)
      .map(num => num.trim())
      .filter(num => num.length > 0)
      .map(num => num.padStart(numDigits, '0'))
      .filter(num => regex.test(num) && parseInt(num) >= 0 && parseInt(num) <= maxValue);
    
    setSelectedNumbers([...new Set(inputNumbers)]); // Remove duplicates
    setNumberInput('');
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
    setNumberInput('');
  };

  const removeNumber = (number) => {
    setSelectedNumbers(prev => prev.filter(n => n !== number));
  };

  return {
    selectedNumbers,
    setSelectedNumbers,
    numberInput,
    setNumberInput,
    selectionMode,
    setSelectionMode,
    handleNumberSelect,
    parseNumberInput,
    clearSelection,
    removeNumber
  };
};

