import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { CategorySidebar } from '../components/CategorySidebar';
import { NoteGrid } from '../components/NoteGrid';
import { NoteCard } from '../components/NoteCard';
import { NoteFormModal } from '../components/NoteForm';

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
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<(Note & { id: string }) | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, [token, selectedCategory]);

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
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
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
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCreateNote = async (noteData: Partial<Note>) => {
    try {
      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) throw new Error('Failed to create note');

      await fetchNotes();
      setIsFormOpen(false);
      setEditingNote(undefined);
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

      if (!response.ok) throw new Error('Failed to update note');

      await fetchNotes();
      setIsFormOpen(false);
      setEditingNote(undefined);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete note');

      await fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleArchiveNote = async (noteId: string, isArchived: boolean) => {
    try {
      const endpoint = isArchived ? 'archive' : 'unarchive';
      const response = await fetch(`http://localhost:3001/api/notes/${noteId}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to archive note');

      await fetchNotes();
    } catch (error) {
      console.error('Failed to archive note:', error);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note as Note & { id: string });
    setIsFormOpen(true);
  };

  const handleCreateNewNote = () => {
    setEditingNote(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <CategorySidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <NoteGrid onCreateNew={handleCreateNewNote}>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onArchive={handleArchiveNote}
            />
          ))}
        </NoteGrid>
      </div>

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
  );
};
