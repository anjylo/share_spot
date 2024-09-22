import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';

import * as registerController from '../controllers/registerController.js';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';
import * as postController from '../controllers/postController.js';
import * as chatController from '../controllers/chatController.js';

const router = Router();

router.get('/register', authenticate, registerController.index);
router.get('/login', authenticate, authController.index);
router.get('/user/setting', authenticate, userController.index)
router.get('/user/profile', authenticate, userController.profile)
router.get('/post/:id', authenticate, postController.index)
router.get('/chat', authenticate, chatController.index)

export default router;