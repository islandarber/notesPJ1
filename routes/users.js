import express from 'express';
import {getUser, registerUser, deleteUser } from '../controllers/usersControllers.js';

const usersRouter = express.Router();

usersRouter.get('/', getUser);
usersRouter.post('/register', registerUser);
usersRouter.delete('/:id', deleteUser);




export default usersRouter;