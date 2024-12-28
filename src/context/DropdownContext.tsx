import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Popper, Paper, ClickAwayListener } from '@mui/material';

import type { ReactNode } from 'react';

export type DropdownCloseReason = 'escape' | 'enter' | 'click';

type DropdownState = {
  content: ReactNode | null;
  anchorEl: HTMLElement | null;
  onClose?: (reason: DropdownCloseReason) => void;
};

type DropdownContextType = {
  isDropdownOpen: boolean;
  showDropdown: (
    content: ReactNode,
    anchorEl: HTMLElement,
    onClose?: (reason: DropdownCloseReason) => void
  ) => void;
  hideDropdown: () => void;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

const MemoizedDropdown = memo(
  ({
    content,
    anchorEl,
    onClose = () => {},
  }: {
    content: ReactNode;
    anchorEl: HTMLElement;
    onClose?: (reason: DropdownCloseReason) => void;
  }) => {
    const handleClickAway = (event: MouseEvent | TouchEvent) => {
      if (
        !anchorEl.contains(event.target as Node) &&
        event.target instanceof Node
      ) {
        onClose('click');
      }
    };

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          onClose('enter');
        }
        if (e.key === 'Escape') {
          onClose('escape');
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [onClose]);

    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          open={true}
          anchorEl={anchorEl}
          placement="bottom-start"
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
          ]}
          style={{ zIndex: 1300, width: anchorEl.offsetWidth }}
        >
          <Paper
            elevation={2}
            sx={{
              width: '100%',
              maxHeight: '400px',
              overflow: 'auto',
            }}
          >
            {content}
          </Paper>
        </Popper>
      </ClickAwayListener>
    );
  }
);

export const DropdownProvider = memo(
  ({ children }: { children: ReactNode }) => {
    const [dropdownState, setDropdownState] = useState<DropdownState>({
      content: null,
      anchorEl: null,
      onClose: undefined,
    });

    const showDropdown = useCallback(
      (
        content: ReactNode,
        anchorEl: HTMLElement,
        onClose?: (reason: DropdownCloseReason) => void
      ) => {
        setDropdownState({ content, anchorEl, onClose });
      },
      []
    );

    const hideDropdown = useCallback(() => {
      setDropdownState({ content: null, anchorEl: null, onClose: undefined });
    }, []);

    const contextValue = useMemo(
      () => ({
        isDropdownOpen: !!dropdownState.content,
        showDropdown,
        hideDropdown,
      }),
      [dropdownState.content, showDropdown, hideDropdown]
    );

    return (
      <DropdownContext.Provider value={contextValue}>
        {children}
        {dropdownState.content && dropdownState.anchorEl && (
          <MemoizedDropdown
            content={dropdownState.content}
            anchorEl={dropdownState.anchorEl}
            onClose={dropdownState.onClose}
          />
        )}
      </DropdownContext.Provider>
    );
  }
);

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownProvider');
  }
  return context;
};
