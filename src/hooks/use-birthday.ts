"use client";

import { useState, useEffect, useCallback } from 'react';

const BIRTHDAY_STORAGE_KEY = 'papas-special-day-birthday';
const DEFAULT_BIRTHDAY_ISO = '2025-09-28T00:00:00';

export function useBirthday() {
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedBirthday = localStorage.getItem(BIRTHDAY_STORAGE_KEY);
      if (storedBirthday && !isNaN(new Date(storedBirthday).getTime())) {
        setBirthday(new Date(storedBirthday));
      } else {
        setBirthday(new Date(DEFAULT_BIRTHDAY_ISO));
      }
    } catch (error) {
      console.error('Failed to parse birthday from localStorage', error);
      setBirthday(new Date(DEFAULT_BIRTHDAY_ISO));
    }
    setIsInitialized(true);
  }, []);

  const updateBirthday = useCallback((newDate: Date | null) => {
    if (newDate) {
      setBirthday(newDate);
      try {
        localStorage.setItem(BIRTHDAY_STORAGE_KEY, newDate.toISOString());
      } catch (error) {
        console.error('Failed to save birthday to localStorage', error);
      }
    }
  }, []);

  return { birthday, updateBirthday, isInitialized };
}
