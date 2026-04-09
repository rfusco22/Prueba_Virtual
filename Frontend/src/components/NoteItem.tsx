import React, { useState } from 'react'
import { Note } from '../services/notesApi'

interface NoteItemProps {
  note: Note
  onEdit: (note: Note) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
}

export const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit, onArchive, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false)

  const handleDelete = () => {
    onDelete(note.id)
    setShowDelete(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-primary hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 break-words">{note.title}</h3>
        <div className="flex gap-2 ml-2 flex-shrink-0">
          <button
            onClick={() => onEdit(note)}
            className="p-2 bg-primary text-white rounded hover:bg-blue-600 transition"
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={() => onArchive(note.id)}
            className="p-2 bg-secondary text-white rounded hover:bg-green-600 transition"
            title="Archive"
          >
            {note.isArchived ? '↺' : '📦'}
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-3 break-words">{note.content}</p>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
        {note.isArchived && <span className="bg-gray-200 px-2 py-1 rounded">Archived</span>}
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p className="mb-4 font-semibold">¿Eliminar esta nota?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
