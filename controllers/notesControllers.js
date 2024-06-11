import Note from '../models/notes.js';
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createNote = async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
  });
  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editNote = async (req, res) => {
  const { id } = req.params;
  const note = {
    title: req.body.title,
    content: req.body.content,
  };
  try {
    const editedNote = await Note.findByIdAndUpdate(id, note, { new: true });
    res.json(editedNote);
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await Note.findByIdAndDelete(id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};