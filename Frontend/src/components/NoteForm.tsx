import React, { useState, useEffect } from 'react'
import { Note, CreateNotePayload } from '../services/notesApi'

interface NoteFormProps {
  onSubmit: (payload: CreateNotePayload) => Promise<void>
  onCancel: () => void
  initialNote?: Note
  isLoading?: boolean
}

export const NoteForm: React.FC<NoteFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialNote,
  isLoading = false 
}) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title)
      setContent(initialNote.content)
    }
  }, [initialNote])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      alert('Por favor completa todos los campos')
      return
    }
    await onSubmit({ title, content })
    setTitle('')
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-6 border-t-4 border-primary">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {initialNote ? 'Editar Nota' : 'Nueva Nota'}
      </h2>
      
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        disabled={isLoading}
      />
      
      <textarea
        placeholder="Contenido"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        disabled={isLoading}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isLoading ? 'Guardando...' : initialNote ? 'Actualizar' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
