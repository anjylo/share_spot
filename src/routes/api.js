import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';

import * as authController from '../controllers/authController.js';
import * as postController from '../controllers/postController.js';
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

// Post
router.get('/posts/:id?/:offset?', authenticate, postController.getPosts);
router.get('/post/:id', authenticate, postController.getPost);
router.post('/post', authenticate, postController.createPost);
router.put('/post', authenticate, postController.updatePost);
router.delete('/post/:id', authenticate, postController.deletePost);

export default router;