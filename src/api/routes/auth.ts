import express from 'express';
import authCtrl from '../controllers/auth';
import { user, verifyToken } from '../middleware/authorization';

const router = express.Router();

router.post('/signup', authCtrl.signUp);
router.post('/signin', authCtrl.signIn);
router.post('/social', authCtrl.socialLogin);
router.post('/logout', user, authCtrl.signOut);
router.get('/', verifyToken, authCtrl.getUser);

export default router;
