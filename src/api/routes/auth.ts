import express from 'express';
import auth from '../controllers/auth';

const router = express.Router();

router.post('/signup', auth.signUp);
router.post('/signin', auth.signIn);

export default router;
