import express from 'express';
import { getNotes, createNote, editNote, deleteNote } from '../controllers/notesControllers.js';

const notesRouter = express.Router();

notesRouter.get('/', getNotes);
notesRouter.post('/', createNote);
notesRouter.put('/:id', editNote);
notesRouter.delete('/:id', deleteNote);

export default notesRouter;
