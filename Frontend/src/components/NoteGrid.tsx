import React from 'react';
import { Plus } from 'lucide-react';

interface NoteGridProps {
  children: React.ReactNode;
  onCreateNew: () => void;
}

export const NoteGrid: React.FC<NoteGridProps> = ({ children, onCreateNew }) => {
  return (
    <div className="p-8 flex-1 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notes</h2>
          <p className="text-slate-600 text-sm">Organize your thoughts</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
        >
          <Plus size={18} />
          New Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
        {children}
      </div>
    </div>
  );
};
