import { Router } from 'express';
import AuthController from '../../controllers/v1/authController.js';

const router = Router();

const auth = new AuthController();

router.post('/signup', auth.signup);
router.post('/login', auth.login);

export default router;
