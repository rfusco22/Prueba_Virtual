import React from 'react';
import { Plus } from 'lucide-react';

interface NoteGridProps {
  children: React.ReactNode;
  onCreateNew: () => void;
}

// Frontend/src/components/NoteGrid.tsx
export const NoteGrid: React.FC<{ children: React.ReactNode, onCreateNew: () => void }> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {children}
    </div>
  );
};
