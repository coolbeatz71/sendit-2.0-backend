import express from 'express';
import authCtrl from '../controllers/auth';

const router = express.Router();

router.post('/signup', authCtrl.signUp);
router.post('/signin', authCtrl.signIn);

export default router;
