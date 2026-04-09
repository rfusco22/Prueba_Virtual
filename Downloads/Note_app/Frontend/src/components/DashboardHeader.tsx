import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, Menu } from 'lucide-react'; // Añadimos Menu
import { Button } from "./ui/button";

interface DashboardHeaderProps {
  onMenuClick?: () => void; // Prop para abrir el sidebar móvil
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-100 px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* BOTÓN HAMBURGUESA: Visible solo en móvil/tablet */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden h-9 w-9 text-slate-600"
        >
          <Menu size={20} />
        </Button>

        <div className="flex items-center gap-2.5">
          
          <h1 className="text-sm font-bold text-slate-900 tracking-tight hidden xs:block">
            FuscoNotes
          </h1>
        </div>
      </div>
      
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all h-9 px-3"
      >
        <LogOut size={14} />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </header>
  );
};