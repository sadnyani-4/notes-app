import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from './firebase';
import './NotesPage.css';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const notesCollectionRef = collection(db, 'notes');
  const [recorder, setRecorder] = useState(null);
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const fetchNotes = async () => {
    const data = await getDocs(notesCollectionRef);
    setNotes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote && !audioBlob) return;

    const noteData = { text: newNote, uid: auth.currentUser.uid };

    if (audioBlob) {
      const audioData = await audioBlob.arrayBuffer();
      const audioBase64 = window.btoa(String.fromCharCode(...new Uint8Array(audioData)));
      noteData.audio = audioBase64;
      noteData.transcript = transcript;
    }

    await addDoc(notesCollectionRef, noteData);
    setNewNote('');
    setAudioBlob(null);
    setTranscript('');
    fetchNotes();
  };

  const handleDeleteNote = async (id) => {
    const noteDoc = doc(db, 'notes', id);
    await deleteDoc(noteDoc);
    fetchNotes();
  };

  const startEditNote = (note) => {
    setEditNoteId(note.id);
    setEditNoteText(note.text);
  };

  const handleEditNote = async (e) => {
    e.preventDefault();
    if (!editNoteText && !audioBlob) return;

    const noteDoc = doc(db, 'notes', editNoteId);
    const noteData = { text: editNoteText };

    if (audioBlob) {
      const audioData = await audioBlob.arrayBuffer();
      const audioBase64 = window.btoa(String.fromCharCode(...new Uint8Array(audioData)));
      noteData.audio = audioBase64;
      noteData.transcript = transcript;
    }

    await updateDoc(noteDoc, noteData);
    setEditNoteId(null);
    setEditNoteText('');
    fetchNotes();
  };

  const startRecording = () => {
    if (recorder) {
      recorder.start();
      recognition.start();
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    if (recorder) {
      recorder.stop();
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleAudioRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newRecorder = new MediaRecorder(stream);

    newRecorder.ondataavailable = async (event) => {
      setAudioBlob(event.data);
    };

    newRecorder.start();
    setRecorder(newRecorder);

    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
    };

    recognition.onerror = (event) => {
      console.error("Error during speech recognition:", event.error);
    };
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="notes-container">
      <h2 className="header"><i className="fas fa-sticky-note"></i> Your Notes 📓</h2>

      <form onSubmit={handleAddNote} className="note-form">
        <input
          type="text"
          placeholder="Add a new note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button type="submit" className="add-button">
          <i className="fas fa-plus"></i> Add Note
        </button>
      </form>

      <div className="audio-section">
        <button onClick={handleAudioRecording} className="record-button">
          <i className="fas fa-microphone"></i>
        </button>
        <button onClick={stopRecording} className="stop-button">
          <i className="fas fa-stop"></i>
        </button>

        {isRecording && <div className="waveform"></div>}
        {audioBlob && <p className="audio-recorded">Audio recorded! You can add it along with your note.</p>}
        {transcript && <p className="transcript">Transcript: {transcript}</p>}
      </div>

      {editNoteId && (
        <form onSubmit={handleEditNote} className="edit-form">
          <input
            type="text"
            placeholder="Edit note"
            value={editNoteText}
            onChange={(e) => setEditNoteText(e.target.value)}
          />
          <button type="submit" className="edit-button">
            <i className="fas fa-edit"></i> Update Note
          </button>
          <button type="button" onClick={() => setEditNoteId(null)} className="cancel-button">
            <i className="fas fa-times"></i> Cancel
          </button>
        </form>
      )}

      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.id} className="note">
            <p>{note.text}</p>
            {note.audio && <audio controls src={`data:audio/wav;base64,${note.audio}`} />}
            {note.transcript && <p className="transcript">Transcript: {note.transcript}</p>}
            <button onClick={() => handleDeleteNote(note.id)} className="delete-button">
              <i className="fas fa-trash"></i>
            </button>
            <button onClick={() => startEditNote(note)} className="edit-button">
              <i className="fas fa-edit"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;