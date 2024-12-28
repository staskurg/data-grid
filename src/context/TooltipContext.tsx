import {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Tooltip } from '@mui/material';

import type { ReactNode } from 'react';

type TooltipState = {
  content: ReactNode | null;
  anchorEl: HTMLElement | null;
};

type TooltipContextType = {
  showTooltip: (content: ReactNode, anchorEl: HTMLElement) => void;
  hideTooltip: () => void;
};

const TooltipContext = createContext<TooltipContextType | null>(null);

const MemoizedTooltip = memo(
  ({
    content,
    anchorEl,
    onClose,
  }: {
    content: ReactNode;
    anchorEl: HTMLElement;
    onClose: () => void;
  }) => {
    const getPosition = (el: HTMLElement) => ({
      left: el.getBoundingClientRect().left + el.offsetWidth / 2,
      top: el.getBoundingClientRect().top,
    });

    return (
      <Tooltip
        open={true}
        arrow
        placement="top"
        title={content}
        onClose={onClose}
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: 'common.white',
              color: 'text.secondary',
              boxShadow: 2,
            },
          },
          arrow: {
            sx: {
              color: 'common.white',
            },
          },
        }}
      >
        <span
          style={{
            position: 'fixed',
            ...getPosition(anchorEl),
          }}
        />
      </Tooltip>
    );
  }
);

export const TooltipProvider = memo(({ children }: { children: ReactNode }) => {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    content: null,
    anchorEl: null,
  });

  const showTooltip = useCallback(
    (content: ReactNode, anchorEl: HTMLElement) => {
      setTooltipState({ content, anchorEl });
    },
    []
  );

  const hideTooltip = useCallback(() => {
    setTooltipState({ content: null, anchorEl: null });
  }, []);

  const contextValue = useMemo(
    () => ({ showTooltip, hideTooltip }),
    [showTooltip, hideTooltip]
  );

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
      {tooltipState.content && tooltipState.anchorEl && (
        <MemoizedTooltip
          content={tooltipState.content}
          anchorEl={tooltipState.anchorEl}
          onClose={hideTooltip}
        />
      )}
    </TooltipContext.Provider>
  );
});

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};
