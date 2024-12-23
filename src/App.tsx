import { TooltipProvider } from './context/TooltipContext';
import Homepage from './pages/Homepage';

const App = () => {
  return (
    <TooltipProvider>
      <Homepage />
    </TooltipProvider>
  );
};

export default App;
