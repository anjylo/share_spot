import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';

import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';

const router = Router();

// Auth
router.post('/login', authController.login);
router.get('/logout', authenticate, authController.logout);

// User
router.post('/user/register', authenticate, userController.createUser);
router.get('/users', authenticate, userController.getUsers);
router.get('/user', authenticate, userController.getUser);
router.put('/user', authenticate, userController.updateUser);

export default router;