import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CategoriesPage } from './pages/CategoriesPage';
//import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Ruta Principal */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta de Categorías Protegida */}
          <Route 
            path="/categories" 
            element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            } 
          />

          {/* Comodín para redirigir al login o home si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
