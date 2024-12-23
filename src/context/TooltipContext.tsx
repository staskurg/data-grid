import { createContext, useContext, useState } from 'react';
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

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    content: null,
    anchorEl: null,
  });
  console.log(tooltipState);

  const showTooltip = (content: ReactNode, anchorEl: HTMLElement) => {
    setTooltipState({ content, anchorEl });
  };

  const hideTooltip = () => {
    setTooltipState({ content: null, anchorEl: null });
  };

  const getPosition = (anchorEl: HTMLElement) => ({
    left: anchorEl.getBoundingClientRect().left + anchorEl.offsetWidth / 2,
    top: anchorEl.getBoundingClientRect().top,
  });

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      {tooltipState.content && tooltipState.anchorEl && (
        <Tooltip
          open={true}
          arrow
          placement="top"
          title={tooltipState.content}
          onClose={hideTooltip}
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: 'common.white',
                color: 'text.secondary',
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
              ...getPosition(tooltipState.anchorEl),
            }}
          />
        </Tooltip>
      )}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};
