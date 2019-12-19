import express from 'express';
import parcel from '../controllers/parcels';
import { user } from '../middleware/authorization';

const router = express.Router();

router.post('/', user, parcel.create);
router.get('/:id', user, parcel.getById);
router.put('/:id', user, parcel.update);
router.put('/cancel/:id', user, parcel.cancel);
router.get('/private/:id', user, parcel.getAllPrivate);
router.delete('/:id', user, parcel.delete);

export default router;
