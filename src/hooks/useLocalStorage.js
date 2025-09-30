import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // State để lưu giá trị
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Lấy từ local storage theo key
      const item = window.localStorage.getItem(key);
      // Parse JSON hoặc trả về initialValue nếu không có
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Nếu có lỗi thì trả về initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Trả về wrapped version của useState setter function để persist value
  const setValue = (value) => {
    try {
      // Cho phép value là function để có API giống như useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Lưu vào state
      setStoredValue(valueToStore);
      // Lưu vào local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
