import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';
import { notesAPI } from '../services/api';
import NoteCard from '../components/NoteCard';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await notesAPI.getNotes();
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      )
    );
  };

  const handleNoteDeleted = (deletedNoteId) => {
    setNotes(prevNotes => 
      prevNotes.filter(note => note.id !== deletedNoteId)
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading notes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
        <Link
          to="/create-note"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No notes yet</h2>
          <p className="text-gray-500 mb-6">
            Start by creating your first note to keep track of your thoughts and ideas.
          </p>
          <Link
            to="/create-note"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Note
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onNoteUpdated={handleNoteUpdated}
              onNoteDeleted={handleNoteDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;