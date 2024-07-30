import Note from '../models/notes.js';
import User from '../models/users.js';

export const getNotes = async (req, res) => {
  const userId = req.user.id;
  try {
    const notes = await Note.find({ user: userId, isDeleted: false }).populate('user');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDNotes = async (req, res) => {
  const userId = req.user.id;
  try {
    const notes = await Note.find({ user: userId, isDeleted: true }).populate('user');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNote = async (req, res) => {
  const { title, content, color } = req.body;
  const { id } = req.user; 
  try {
    const note = new Note({
      title,
      content,
      color,
      user: id,
    });
    const savedNote = await note.save();
    await User.findByIdAndUpdate(id, { $push: { notes: savedNote._id } });
    return res.status(201).json(savedNote);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const editNote = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Get the authenticated user's ID

  if (!id) {
    return res.status(400).json({ message: 'Note ID not provided' });
  }

  const noteUpdates = {
    title: req.body.title,
    content: req.body.content,
    isDeleted: req.body.isDeleted,
    date: new Date(),
  };

  try {
    // Find the note to ensure it belongs to the authenticated user
    const note = await Note.findOne({ _id: id, user: userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Update the note
    const editedNote = await Note.findByIdAndUpdate(id, noteUpdates, { new: true }).populate('user');
    return res.json(editedNote);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const softDeleteNote = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) {
    return res.status(400).json({ message: 'Not Found' });
  }

  try {
    const note = await Note.findOne({ _id: id, user: userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isDeleted = true;
    await note.save();
    return res.json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) {
    return res.status(400).json({ message: 'Not Found' });
  }

  try {
    const note = await Note.findOne({ _id: id, user: userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await Note.findByIdAndDelete(id);
    return res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
