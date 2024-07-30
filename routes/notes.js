import express from 'express';
import { getNotes, createNote, editNote, deleteNote, softDeleteNote, getDNotes } from '../controllers/notesControllers.js';
import { authMiddleware } from '../middleware/userAuth.js';

const notesRouter = express.Router();

notesRouter.get('/',authMiddleware, getNotes);
notesRouter.get('/deleted',authMiddleware, getDNotes);
notesRouter.post('/',authMiddleware, createNote);
notesRouter.put('/:id',authMiddleware, editNote);
notesRouter.delete('/soft/:id',authMiddleware, softDeleteNote);
notesRouter.delete('/:id',authMiddleware, deleteNote);

export default notesRouter;
