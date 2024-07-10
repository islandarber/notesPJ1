import express from 'express';
import { getNotes, createNote, editNote, deleteNote, softDeleteNote, getDNotes } from '../controllers/notesControllers.js';

const notesRouter = express.Router();

notesRouter.get('/', getNotes);
notesRouter.get('/deleted', getDNotes);
notesRouter.post('/', createNote);
notesRouter.put('/:id', editNote);
notesRouter.delete('/soft/:id', softDeleteNote);
notesRouter.delete('/:id', deleteNote);

export default notesRouter;
