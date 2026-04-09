import React from 'react';
import { Trash2, Archive, Edit2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  tags?: string[];
  category?: { id: string; name: string; color?: string };
  createdAt: string;
  isArchived: boolean;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onArchive: (noteId: string, isArchived: boolean) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onArchive }) => {
  const displayDate = new Date(note.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: note.createdAt.includes(new Date().getFullYear().toString()) ? undefined : 'numeric',
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all h-full flex flex-col">
      <div className="flex-1 mb-4">
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{note.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {note.excerpt || note.content}
        </p>
      </div>

      <div className="space-y-3">
        {note.tags && note.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {note.category && (
          <div className="flex items-center gap-2">
            {note.category.color && (
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: note.category.color }} />
            )}
            <span className="text-xs text-slate-500">{note.category.name}</span>
          </div>
        )}

        <div className="text-xs text-slate-400 mb-3">{displayDate}</div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => onEdit(note)}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors text-sm"
        >
          <Edit2 size={14} />
          Edit
        </button>
        <button
          onClick={() => onArchive(note.id, !note.isArchived)}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors text-sm"
        >
          <Archive size={14} />
          {note.isArchived ? 'Restore' : 'Archive'}
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors text-sm"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};
