import { useEffect, useState } from 'react';

export default function useStoredState(key, _initialValue) {
  const savedValue = localStorage.getItem(key);
  const initialValue = savedValue !== null ? JSON.parse(savedValue) : _initialValue;

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
