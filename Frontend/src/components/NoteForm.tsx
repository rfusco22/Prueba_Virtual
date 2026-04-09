import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface Note {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  categoryId?: string;
  isArchived?: boolean;
}

interface NoteFormProps {
  note?: Note & { id: string };
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: Note) => Promise<void>;
}

export const NoteFormModal: React.FC<NoteFormProps> = ({
  note,
  categories,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Note>({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    categoryId: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (note) {
      setFormData(note);
      setTagInput('');
    } else {
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        tags: [],
        categoryId: '',
      });
    }
  }, [note, isOpen]);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {note ? 'Edit Note' : 'New Note'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Note title"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your note here..."
              rows={6}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Excerpt
            </label>
            <input
              type="text"
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary (optional)"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>
            <select
              value={formData.categoryId || ''}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || undefined })}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag and press Enter"
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                Add
              </button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-slate-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
