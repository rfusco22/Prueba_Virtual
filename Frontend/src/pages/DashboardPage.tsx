import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { CategorySidebar } from '../components/CategorySidebar';
import { NoteGrid } from '../components/NoteGrid';
import { NoteCard } from '../components/NoteCard';
import { NoteFormModal } from '../components/NoteForm';
import { Plus, Inbox, Archive as ArchiveIcon, Loader2, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface Note {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  tags?: string[];
  category?: Category;
  categoryId?: string;
  createdAt: string;
  isArchived: boolean;
}

export const DashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. ESTADOS
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Sincronización inicial con la URL (?view=archived)
  const isArchivedParam = searchParams.get('view') === 'archived';
  const [showArchived, setShowArchived] = useState(isArchivedParam);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<(Note & { id: string }) | undefined>();
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // EFECTO: Detectar cambios en la URL (cuando navegas desde CategoriesPage)
  useEffect(() => {
    setShowArchived(isArchivedParam);
  }, [isArchivedParam]);

  // EFECTO: Carga de datos
  useEffect(() => {
    if (token) {
      fetchNotes();
      fetchCategories();
    }
  }, [token, selectedCategory, showArchived]);

  // FUNCIÓN: Cambiar entre notas/archivados y actualizar la URL
  const handleToggleArchived = (val: boolean) => {
    setShowArchived(val);
    if (val) {
      setSearchParams({ view: 'archived' });
    } else {
      setSearchParams({}); // Limpia la URL (?view=archived desaparece)
    }
  };

  // 2. PETICIONES AL SERVIDOR
  const fetchNotes = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:3001/api/notes';
      if (selectedCategory) {
        url += `?categoryId=${selectedCategory}`;
      }
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (error) {
      console.error('Categories error:', error);
    }
  };

  const handleCreateNote = async (noteData: Partial<Note>) => {
    try {
      const payload = {
        title: noteData.title,
        content: noteData.content,
        categoryId: noteData.categoryId || null,
      };
      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        await fetchNotes();
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleUpdateNote = async (noteData: Partial<Note>) => {
    if (!editingNote?.id) return;
    try {
      const response = await fetch(`http://localhost:3001/api/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });
      if (response.ok) {
        await fetchNotes();
        setIsFormOpen(false);
        setEditingNote(undefined);
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('¿Eliminar nota?')) return;
    try {
      await fetch(`http://localhost:3001/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchNotes();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleArchiveNote = async (noteId: string, isCurrentlyArchived: boolean) => {
    try {
      const endpoint = isCurrentlyArchived ? 'unarchive' : 'archive';
      const response = await fetch(`http://localhost:3001/api/notes/${noteId}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) await fetchNotes();
    } catch (error) {
      console.error('Failed to archive note:', error);
    }
  };

  const handleCreateNewNote = () => {
    setEditingNote(undefined);
    setIsFormOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note as Note & { id: string });
    setIsFormOpen(true);
  };

  // FILTRADO MANUAL: Basado en el estado showArchived
  const displayedNotes = notes.filter(note => note.isArchived === showArchived);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* SIDEBAR ESCRITORIO */}
      <aside className="hidden md:flex h-full shrink-0 border-r border-slate-200">
        <CategorySidebar 
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            handleToggleArchived(false); // Al filtrar por categoría, quitamos archivados
          }}
          showArchived={showArchived}
          onToggleArchived={handleToggleArchived}
        />
      </aside>

      {/* SIDEBAR MÓVIL */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-72 h-full bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-bold text-slate-900">FuscoNotes</span>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={18} /></button>
            </div>
            {/* SIDEBAR MÓVIL (Drawer) */}
            <div className="flex-1 overflow-y-auto">
              <CategorySidebar 
                hideLogo={true}
                selectedCategory={selectedCategory}
                onSelectCategory={(id) => {
                  setSelectedCategory(id);
                  handleToggleArchived(false);
                  setIsMobileMenuOpen(false);
                }}
                showArchived={showArchived}
                onToggleArchived={(val) => {
                  handleToggleArchived(val);
                  setIsMobileMenuOpen(false);
                }}
                onClose={() => setIsMobileMenuOpen(false)} // <--- AGREGA ESTA LÍNEA
              />
            </div>
          </div>
        </div>
      )}

      {/* ÁREA DE CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <DashboardHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Responsivo Mejorado */}
            <div className="flex items-center justify-between mb-8 gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-slate-100 rounded-lg shrink-0 hidden xs:block">
                  {showArchived ? <ArchiveIcon className="w-5 h-5 text-slate-600" /> : <Inbox className="w-5 h-5 text-slate-600" />}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight truncate">
                  {showArchived ? 'Archived' : 'Notes'}
                </h2>
              </div>

              {!showArchived && (
                <button 
                  onClick={handleCreateNewNote} 
                  className="bg-slate-900 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 flex items-center gap-2 transition-all shadow-md shrink-0 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Note</span>
                  <span className="sm:hidden">New Note</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                <p className="text-slate-400 text-sm">Loading your thoughts...</p>
              </div>
            ) : displayedNotes.length > 0 ? (
              <NoteGrid onCreateNew={handleCreateNewNote}>
                {displayedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onArchive={() => handleArchiveNote(note.id, note.isArchived)}
                  />
                ))}
              </NoteGrid>
            ) : (
              /* EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                  {showArchived ? <ArchiveIcon size={40} /> : <Inbox size={40} />}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {showArchived ? 'No archived notes yet' : 'Your inbox is empty'}
                </h3>
                <p className="text-slate-500 text-sm max-w-[280px] mb-8 leading-relaxed">
                  {showArchived 
                    ? 'Notes you archive will appear here to keep your workspace clutter-free.' 
                    : 'Start capturing your ideas and organizing your daily tasks right now.'}
                </p>
                {!showArchived && (
                  <button 
                    onClick={handleCreateNewNote}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    <Plus className="w-4 h-4" /> Create my first note
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        <NoteFormModal
          note={editingNote}
          categories={categories}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingNote(undefined);
          }}
          onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
        />
      </div>
    </div>
  );
};