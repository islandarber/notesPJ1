import Note from '../models/notes.js';
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ isDeleted: false});
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDNotes = async (req, res) => {
  try {
    const notes = await Note.find({ isDeleted: true});
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNote = async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    color: req.body.color,
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
  if (!id) {
    res.status(400).json({ message: 'not Found' });
    return;
  }
    try {
      const editedNote = await Note.findByIdAndUpdate(id, note, { new: true });
      res.json(editedNote);
    }
    catch (error) {
      res.status(400).json({ message: error.message });
    }
 
};

export const softDeleteNote = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: 'not Found' });
    return;
  }
  try {
    const note = await Note.findById(id);
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
    } else {
      note.isDeleted = true;
      await note.save();
      res.json(note);
    }
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: 'not Found' });
    return;
  }
  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      res.status(404).json({ message: 'Note not found' });
    } else {
      res.json({ message: 'Note deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};