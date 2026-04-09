import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Tag, Hash, Archive, LayoutGrid 
} from 'lucide-react';
import { Button } from "./ui/button";

interface CategorySidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  showArchived: boolean;
  onToggleArchived: (show: boolean) => void;
  hideLogo?: boolean;
  onClose?: () => void; // Prop para cerrar el menú móvil
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ 
  selectedCategory, 
  onSelectCategory,
  showArchived,
  onToggleArchived,
  hideLogo = false,
  onClose 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Función auxiliar para manejar clics y cerrar el sidebar en móvil
  const handleAction = (callback: () => void) => {
    callback();
    if (onClose) onClose(); // Cierra el drawer móvil si existe la función
  };

  return (
    <aside className="w-full md:w-64 bg-slate-50/50 border-r border-slate-200 flex flex-col h-full">
      <div className="p-6">
        {!hideLogo && (
          <div className="flex items-center gap-2.5 mb-9 px-2">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
              <Hash className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg">FuscoNotes</span>
          </div>
        )}

        <nav className="space-y-1.5">
          {/* BOTÓN NOTES */}
          <Button
            variant={location.pathname === '/' && !showArchived ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-all"
            onClick={() => handleAction(() => {
              navigate('/');
              onToggleArchived(false);
              onSelectCategory(null);
            })}
          >
            <LayoutGrid className="w-4 h-4 opacity-70" />
            Notes
          </Button>

          {/* BOTÓN CATEGORY */}
          <Button
            variant={location.pathname === '/categories' ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-all"
            onClick={() => handleAction(() => {
              navigate('/categories');
            })}
          >
            <Tag className="w-4 h-4 opacity-70" />
            Category
          </Button>

          {/* BOTÓN ARCHIVED */}
          <Button
            variant={showArchived ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 h-10 px-3 text-sm font-medium"
            onClick={() => handleAction(() => {
              navigate('/?view=archived');
              onToggleArchived(true);
            })}
          >
            <Archive className="w-4 h-4 opacity-70" />
            Archived
          </Button>
        </nav>
      </div>

      {/* Perfil al Fondo */}
      <div className="mt-auto p-5 border-t border-slate-200 bg-white/50">
         <div className="flex items-center gap-3 px-1">
           <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-slate-100">RF</div>
           <div className="flex flex-col">
             <span className="text-xs font-bold text-slate-900">Riccardo Fusco</span>
             <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Software Engineer</span>
           </div>
         </div>
      </div>
    </aside>
  );
};