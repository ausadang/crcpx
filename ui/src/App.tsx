import React from 'react';
import { ThemeProvider } from './styles/contexts/ThemeContext';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;