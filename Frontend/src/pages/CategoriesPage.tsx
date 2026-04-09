import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { CategorySidebar } from '../components/CategorySidebar';
import { 
  Plus, Trash2, Edit3, Check, X, Search, 
  Tag, LayoutGrid, SlidersHorizontal 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from "sonner";

export const CategoriesPage: React.FC = () => {
  const { token } = useAuth();
  
  // ESTADOS DE DATOS
  const [categories, setCategories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // <--- BÚSQUEDA DE CATEGORÍAS

  // ESTADO PARA EL MENÚ MÓVIL (Esto es lo que te faltaba)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => { 
    if (token) {
      fetchCategories(); 
    }
  }, [token]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
        if (response.status === 401) toast.error("Sesión expirada");
      }
    } catch (error) { 
      setCategories([]); 
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName, color: '#3b82f6' }),
      });
      if (response.ok) {
        setNewName('');
        setIsAdding(false);
        fetchCategories();
        toast.success("Categoría creada");
      }
    } catch (error) { toast.error("Error al crear"); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar categoría?")) return;
    try {
      await fetch(`http://localhost:3001/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
      toast.success("Categoría eliminada");
    } catch (error) { toast.error("Error al eliminar"); }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const response = await fetch(`http://localhost:3001/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName }),
      });
      if (response.ok) {
        setEditingId(null);
        fetchCategories();
        toast.success("Categoría actualizada");
      }
    } catch (error) { toast.error("Error al actualizar"); }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      
      {/* SIDEBAR ESCRITORIO */}
      <aside className="hidden md:flex h-full shrink-0 border-r border-slate-200">
        <CategorySidebar 
          selectedCategory={null} 
          onSelectCategory={() => {}} 
          showArchived={false} 
          onToggleArchived={() => {}} 
        />
      </aside>

      {/* --- SIDEBAR MÓVIL (Drawer) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay oscuro */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Contenido del Sidebar */}
          <div className="relative w-72 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col min-w-0">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-slate-900 tracking-tight text-base truncate">FuscoNotes</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-1.5 -mr-1 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <CategorySidebar 
                hideLogo={true}
                selectedCategory={null}
                onSelectCategory={() => {
                  setIsMobileMenuOpen(false);
                }}
                showArchived={false}
                onToggleArchived={() => {
                  setIsMobileMenuOpen(false);
                }}
                onClose={() => setIsMobileMenuOpen(false)} // <--- Esto cierra el menú al navegar
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* PASAMOS LA FUNCIÓN AL HEADER */}
        <DashboardHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Categories</h2>
                <p className="text-sm text-slate-500">Create, edit or delete your organization labels.</p>
              </div>
              {!isAdding && (
                <Button onClick={() => setIsAdding(true)} className="bg-slate-900 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
              )}
            </div>

            {/* BARRA DE BÚSQUEDA CON SEPARACIÓN */}
              <div className="flex gap-2 mb-2">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <Input 
                    placeholder="Search categories..." 
                    className="pl-10 h-11 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-slate-900/5 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
              </div>
            

            <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 divide-y divide-slate-50">
                
                {isAdding && (
                  <div className="p-4 bg-slate-50/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                    <Input 
                      autoFocus
                      placeholder="Category name..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                      className="max-w-xs bg-white"
                    />
                    <Button onClick={handleCreate} size="sm" className="bg-slate-900 text-white">Save</Button>
                    <Button onClick={() => setIsAdding(false)} variant="ghost" size="sm">Cancel</Button>
                  </div>
                )}

                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color || '#cbd5e1' }} />
                        
                        {editingId === cat.id ? (
                          <Input 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                            className="h-9 max-w-[300px] bg-white"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-slate-700">{cat.name}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {editingId === cat.id ? (
                          <>
                            <Button size="icon" variant="ghost" className="text-green-600 hover:bg-green-50" onClick={() => handleUpdate(cat.id)}>
                              <Check size={18}/>
                            </Button>
                            <Button size="icon" variant="ghost" className="text-slate-400" onClick={() => setEditingId(null)}>
                              <X size={18}/>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="icon" variant="ghost" className="text-slate-400 hover:text-slate-600" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>
                              <Edit3 size={16}/>
                            </Button>
                            <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(cat.id)}>
                              <Trash2 size={16}/>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  !isAdding && (
                    <div className="p-12 text-center text-slate-400 text-sm italic">
                      No categories found. Click "Add New" to start.
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
