import React, { useState, useEffect } from 'react'
import { NoteForm } from './components/NoteForm'
import { NoteItem } from './components/NoteItem'
import { notesApi, Note, CreateNotePayload } from './services/notesApi'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadNotes = async (filterType: 'all' | 'active' | 'archived' = filter) => {
    setLoading(true)
    setError(null)
    try {
      let response
      if (filterType === 'active') {
        response = await notesApi.getActive()
      } else if (filterType === 'archived') {
        response = await notesApi.getArchived()
      } else {
        response = await notesApi.getAll()
      }
      setNotes(response.data)
    } catch (err) {
      setError('Error al cargar las notas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const handleFilterChange = (newFilter: 'all' | 'active' | 'archived') => {
    setFilter(newFilter)
    loadNotes(newFilter)
  }

  const handleCreateNote = async (payload: CreateNotePayload) => {
    setLoading(true)
    try {
      await notesApi.create(payload)
      setShowForm(false)
      await loadNotes()
    } catch (err) {
      setError('Error al crear la nota')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateNote = async (payload: CreateNotePayload) => {
    if (!editingNote) return
    setLoading(true)
    try {
      await notesApi.update(editingNote.id, payload)
      setEditingNote(null)
      setShowForm(false)
      await loadNotes()
    } catch (err) {
      setError('Error al actualizar la nota')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (id: string) => {
    setLoading(true)
    try {
      await notesApi.delete(id)
      await loadNotes()
    } catch (err) {
      setError('Error al eliminar la nota')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleArchiveNote = async (id: string) => {
    setLoading(true)
    try {
      const note = notes.find(n => n.id === id)
      if (note?.isArchived) {
        await notesApi.unarchive(id)
      } else {
        await notesApi.archive(id)
      }
      await loadNotes()
    } catch (err) {
      setError('Error al cambiar estado de la nota')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (note: Note) => {
    setEditingNote(note)
    setShowForm(true)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingNote(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-primary shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">📝 Mis Notas</h1>
          <p className="text-blue-100 mt-1">Gestiona tus notas de forma simple y eficaz</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        {(showForm || editingNote) && (
          <NoteForm
            onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
            onCancel={handleFormCancel}
            initialNote={editingNote || undefined}
            isLoading={loading}
          />
        )}

        {!showForm && !editingNote && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold mb-6 text-lg"
          >
            + Nueva Nota
          </button>
        )}

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
            }`}
          >
            Todas ({notes.length})
          </button>
          <button
            onClick={() => handleFilterChange('active')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'active'
                ? 'bg-primary text-white'
                : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
            }`}
          >
            Activas ({notes.filter(n => !n.isArchived).length})
          </button>
          <button
            onClick={() => handleFilterChange('archived')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'archived'
                ? 'bg-primary text-white'
                : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
            }`}
          >
            Archivadas ({notes.filter(n => n.isArchived).length})
          </button>
        </div>

        {loading && !notes.length ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-gray-600 mt-2">Cargando notas...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No hay notas para mostrar</p>
            <p className="text-gray-400 mt-2">¡Crea tu primera nota!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map(note => (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={handleEditClick}
                onArchive={handleArchiveNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
