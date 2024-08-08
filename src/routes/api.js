import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';

import * as userController from '../controllers/userController.js';

const router = Router();

// User
router.post('/user/register', authenticate, userController.createUser);
router.get('/users', authenticate, userController.getUsers);
router.get('/user', authenticate, userController.getUser);
router.put('/user', authenticate, userController.updateUser);

export default router;