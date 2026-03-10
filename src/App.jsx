import { HelmetProvider } from 'react-helmet-async';
import { AppProvider } from './context/AppContext';
import AppRouter from './routes/AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

export default function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </HelmetProvider>
  );
}
