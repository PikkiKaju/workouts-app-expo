import { useState, useCallback } from 'react';
import { LayoutChangeEvent } from 'react-native';

export const RESPONSIVE_BREAKPOINT = 650; // Exporting for use elsewhere if needed

export function useResponsiveLayout(initialWidth?: number | null) {
  const [headerWidth, setHeaderWidth] = useState<number | null>(initialWidth || null);
  const isRowLayout = headerWidth !== null && headerWidth >= RESPONSIVE_BREAKPOINT;

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width !== headerWidth) {
      setHeaderWidth(width);
    }
  }, [headerWidth]); // headerWidth is a dependency

  return { headerWidth, isRowLayout, handleLayout };
}
