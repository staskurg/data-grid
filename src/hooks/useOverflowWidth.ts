import { useState, useLayoutEffect } from 'react';

import type { RefObject } from 'react';

export const useOverflowWidth = (
  columnWidth: number,
  itemRefs: RefObject<(HTMLDivElement | null)[]>,
  itemsLength: number
) => {
  const [visibleCount, setVisibleCount] = useState(itemsLength);

  useLayoutEffect(() => {
    if (!columnWidth) return;

    const chipWidth = 32;
    let totalWidth = 0;
    let visibleElements = 0;

    // Iterate through each item reference to calculate the total width of visible elements
    for (let i = 0; i < itemRefs.current.length; i++) {
      const elementWidth = itemRefs.current[i]?.offsetWidth || 0;
      const nextTotalWidth = totalWidth + elementWidth;

      // If the last element fits within the column width, all items are visible
      if (i === itemRefs.current.length - 1 && nextTotalWidth <= columnWidth) {
        visibleElements = itemsLength;
        break;
      }

      const widthLimit =
        i < itemRefs.current.length - 1 ? columnWidth - chipWidth : columnWidth;
      // Break the loop if the next total width exceeds the width limit
      if (nextTotalWidth > widthLimit) break;

      totalWidth = nextTotalWidth;
      visibleElements++;
    }

    setVisibleCount(visibleElements);
  }, [columnWidth, itemsLength, itemRefs]);

  return visibleCount;
};
