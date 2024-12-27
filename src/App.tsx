import { AppProvider } from './context';
import Homepage from './pages/Homepage';

const App = () => {
  return (
    <AppProvider>
      <Homepage />
    </AppProvider>
  );
};

export default App;
