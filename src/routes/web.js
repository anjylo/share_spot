import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';

import * as registerController from '../controllers/registerController.js';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';

const router = Router();

router.get('/register', authenticate, registerController.index);
router.get('/login', authenticate, authController.index);
router.get('/user', authenticate, userController.index)

export default router;