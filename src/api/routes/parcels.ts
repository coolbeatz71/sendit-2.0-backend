import express from 'express';
import parcelCtrl from '../controllers/parcels';
import { user } from '../middleware/authorization';

const router = express.Router();

router.post('/', user, parcelCtrl.create);
router.get('/:id', user, parcelCtrl.getById);
router.put('/:id', user, parcelCtrl.update);
router.put('/cancel/:id', user, parcelCtrl.cancel);
router.get('/private/:id', user, parcelCtrl.getAllPrivate);
router.delete('/:id', user, parcelCtrl.delete);

export default router;
