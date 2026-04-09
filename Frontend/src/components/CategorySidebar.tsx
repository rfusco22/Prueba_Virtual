import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface CategorySidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, [token]);

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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName, color: '#3b82f6' }),
      });
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setShowNewCategory(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Categories</h2>
        <button
          onClick={() => setShowNewCategory(!showNewCategory)}
          className="w-full flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Plus size={16} />
          New Category
        </button>
      </div>

      {showNewCategory && (
        <form onSubmit={handleAddCategory} className="mb-4 pb-4 border-b border-slate-200">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-3 py-1 text-xs bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowNewCategory(false)}
              className="flex-1 px-3 py-1 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
            selectedCategory === null
              ? 'bg-slate-900 text-white'
              : 'text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Notes
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category.color && (
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
            )}
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-200">
        <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
          Archived
        </button>
      </div>
    </aside>
  );
};
