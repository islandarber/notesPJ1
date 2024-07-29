import express from 'express';
import {getUser, registerUser, deleteUser, loginUser, sendEmail, passwordResetConfirm } from '../controllers/usersControllers.js';
import { authMiddleware } from '../middleware/userAuth.js';
import { checkUser } from '../middleware/checkUserExistence.js';

const usersRouter = express.Router();

usersRouter.get('/',authMiddleware, getUser);
usersRouter.post('/login',loginUser);
usersRouter.post('/register',checkUser, registerUser);
usersRouter.delete('/:id', deleteUser);
usersRouter.post('/reset-password',sendEmail )
usersRouter.post('/reset-password/confirm', passwordResetConfirm )

export default usersRouter;