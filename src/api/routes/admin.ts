import express from 'express';
import parcel from '../controllers/parcels';
import { admin } from '../middleware/authorization';

const router = express.Router();

router.get('/parcels', admin, parcel.getAll);

export default router;
