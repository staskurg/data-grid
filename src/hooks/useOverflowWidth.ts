import { useLayoutEffect, useMemo, useState } from 'react';
import type { RefObject } from 'react';

// Props type definition for the hook
type UseOverflowWidthProps<T> = {
  columnWidth: number; // Available width for items container
  itemsContainerRef: RefObject<HTMLDivElement | null>; // Reference to container element
  items: T[]; // Array of items to display
};

/**
 * Hook to calculate how many items can fit within a container's width
 * @returns number of visible items that fit in the container
 */
export const useOverflowWidth = <T>({
  columnWidth,
  itemsContainerRef,
  items,
}: UseOverflowWidthProps<T>): number => {
  // Store measured widths of individual items
  const [itemWidths, setItemWidths] = useState<number[]>([]);

  // Measure actual DOM element widths when items change
  useLayoutEffect(() => {
    if (!itemsContainerRef.current) return;
    // Get width of each child element in the container
    const widths = Array.from(itemsContainerRef.current.children).map(
      child => child.getBoundingClientRect().width
    );
    setItemWidths(widths);
  }, [items, itemsContainerRef]);

  // Calculate how many items can fit in the available width
  const visibleElements = useMemo(() => {
    if (!columnWidth || !itemWidths.length) return items.length;

    const chipWidth = 32; // Width reserved for the overflow indicator chip
    let totalWidth = 0;
    let visibleCount = 0;

    // Iterate through item widths to find how many fit
    for (let i = 0; i < itemWidths.length; i++) {
      const elementWidth = itemWidths[i];
      const nextTotalWidth = totalWidth + elementWidth;

      // If last item fits completely, show all items
      if (i === itemWidths.length - 1 && nextTotalWidth <= columnWidth) {
        return items.length;
      }

      // Account for chip width except for last item
      const widthLimit =
        i < itemWidths.length - 1 ? columnWidth - chipWidth : columnWidth;
      if (nextTotalWidth > widthLimit) {
        return visibleCount;
      }

      totalWidth = nextTotalWidth;
      visibleCount++;
    }

    return visibleCount;
  }, [columnWidth, itemWidths, items]);

  // console.log({ visibleElements, columnWidth, items, itemWidths });
  return visibleElements;
};
