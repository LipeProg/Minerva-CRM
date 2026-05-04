'use client';

import { useEffect, useRef, useState } from 'react';

type Reviver<T> = (value: unknown) => T;

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  revive?: Reviver<T>
) {
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);
  const initialValueRef = useRef(initialValue);
  const reviveRef = useRef(revive);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(key);

      if (rawValue) {
        const parsedValue = JSON.parse(rawValue) as unknown;
        setValue(reviveRef.current ? reviveRef.current(parsedValue) : (parsedValue as T));
      }
    } catch {
      setValue(initialValueRef.current);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [isHydrated, key, value]);

  return [value, setValue] as const;
}
