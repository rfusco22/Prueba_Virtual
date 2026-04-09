import axios from 'axios'

const API_URL = 'http://localhost:3001/api/notes'

export interface Note {
  id: string
  title: string
  content: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateNotePayload {
  title: string
  content: string
}

export const notesApi = {
  getAll: () => axios.get<Note[]>(API_URL),
  getActive: () => axios.get<Note[]>(`${API_URL}/active`),
  getArchived: () => axios.get<Note[]>(`${API_URL}/archived`),
  getById: (id: string) => axios.get<Note>(`${API_URL}/${id}`),
  create: (payload: CreateNotePayload) => axios.post<Note>(API_URL, payload),
  update: (id: string, payload: Partial<CreateNotePayload>) => 
    axios.put<Note>(`${API_URL}/${id}`, payload),
  delete: (id: string) => axios.delete(`${API_URL}/${id}`),
  archive: (id: string) => axios.post<Note>(`${API_URL}/${id}/archive`),
  unarchive: (id: string) => axios.post<Note>(`${API_URL}/${id}/unarchive`),
}
