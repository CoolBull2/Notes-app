import { useState } from 'react';
import { notesAPI } from '../services/api';

const NoteCard = ({ note, onNoteUpdated, onNoteDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content || '');
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await notesAPI.updateNote(note.id, {
        title: editTitle,
        content: editContent,
      });
      
      onNoteUpdated(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsLoading(true);
      
      try {
        await notesAPI.deleteNote(note.id);
        onNoteDeleted(note.id);
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Note title"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Note content"
              rows="4"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-800">{note.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            disabled={isLoading}
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 transition-colors"
            disabled={isLoading}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
      
      {note.content && (
        <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>
      )}
      
      <div className="text-sm text-gray-500">
        <p>Created: {formatDate(note.created_at)}</p>
        {note.updated_at !== note.created_at && (
          <p>Updated: {formatDate(note.updated_at)}</p>
        )}
      </div>
    </div>
  );
};

export default NoteCard;