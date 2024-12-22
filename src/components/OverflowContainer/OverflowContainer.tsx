import { useRef, useMemo, Fragment } from 'react';
import { Box } from '@mui/material';
import { useOverflowWidth } from '../../hooks/useOverflowWidth';
import OverflowChip from './OverflowChip';

import type { ReactNode } from 'react';

type OverflowContainerProps<T> = {
  items: T[];
  columnWidth?: number;
  renderItem: (item: T, ref: (el: HTMLDivElement | null) => void) => ReactNode;
  renderTooltipContent: (items: T[]) => ReactNode;
};

const OverflowContainer = <T extends { id: string | number }>({
  items = [],
  columnWidth = 0,
  renderItem,
  renderTooltipContent,
}: OverflowContainerProps<T>) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const memoizedItems = useMemo(() => items, [items]);

  const visibleCount = useOverflowWidth(columnWidth, itemRefs, items.length);
  const remainingCount = items.length - visibleCount;
  const visibleItems = memoizedItems.slice(0, visibleCount);

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
      {visibleItems.map((item, index) => (
        <Fragment key={item.id}>
          {renderItem(item, el => {
            itemRefs.current[index] = el;
          })}
        </Fragment>
      ))}
      {remainingCount > 0 && (
        <OverflowChip
          count={remainingCount}
          tooltipContent={renderTooltipContent(items.slice(visibleCount))}
        />
      )}
    </Box>
  );
};

export default OverflowContainer;
