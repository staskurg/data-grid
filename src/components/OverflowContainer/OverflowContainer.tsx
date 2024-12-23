import { useRef, useMemo, Fragment, memo, useCallback } from 'react';
import { Box, Chip } from '@mui/material';
import { useTooltip } from '../../context/TooltipContext';
import { useOverflowWidth } from '../../hooks/useOverflowWidth';

import type { ReactNode } from 'react';

type OverflowContainerProps<T> = {
  items: T[];
  columnWidth?: number;
  renderItem: (item: T, ref: (el: HTMLDivElement | null) => void) => ReactNode;
};

const OverflowContainer = <T extends { id: string | number }>({
  items = [],
  columnWidth = 0,
  renderItem,
}: OverflowContainerProps<T>) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const memoizedItems = useMemo(() => items, [items]);
  const chipRef = useRef<HTMLDivElement>(null);
  const { showTooltip, hideTooltip } = useTooltip();

  const visibleCount = useOverflowWidth(columnWidth, itemRefs, items.length);
  const remainingCount = items.length - visibleCount;
  const visibleItems = useMemo(
    () => memoizedItems.slice(0, visibleCount),
    [memoizedItems, visibleCount]
  );

  const renderItems = (itemsToRender: T[]) =>
    itemsToRender.map(item => (
      <Fragment key={item.id}>
        {renderItem(item, el => {
          itemRefs.current.push(el);
        })}
      </Fragment>
    ));

  const handleMouseEnter = useCallback(
    (hiddenItems: T[]) => {
      if (hiddenItems.length && chipRef.current) {
        showTooltip(
          <Box display="flex" flexDirection="column" gap={1}>
            {hiddenItems.map(item => (
              <Fragment key={item.id}>{renderItem(item, () => {})}</Fragment>
            ))}
          </Box>,
          chipRef.current
        );
      }
    },
    [renderItem, showTooltip]
  );

  const handleMouseLeave = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
      {renderItems(visibleItems)}
      {remainingCount > 0 && (
        <Chip
          ref={chipRef}
          label={`+${remainingCount > 9 ? '9+' : remainingCount}`}
          variant="outlined"
          size="small"
          sx={{
            borderRadius: '4px',
            backgroundColor: '#f5f5f5',
          }}
          onMouseEnter={() => handleMouseEnter(items.slice(visibleCount))}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </Box>
  );
};

OverflowContainer.displayName = 'OverflowContainer';
export default memo(OverflowContainer) as typeof OverflowContainer;
