import { type ReactNode, memo } from 'react';
import { DropdownProvider } from './DropdownContext';
import { TooltipProvider } from './TooltipContext';

type AppProviderProps = {
  children: ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <DropdownProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </DropdownProvider>
  );
};

AppProvider.displayName = 'AppProvider';
export default memo(AppProvider);
