import express from 'express';
import adminCtrl from '../controllers/admin';
import { admin } from '../middleware/authorization';

const router = express.Router();

router.get('/parcels', admin, adminCtrl.getAllParcels);
router.put('/parcels/status/:id', admin, adminCtrl.updateParcelStatus);
router.put('/parcels/location/:id', admin, adminCtrl.updateParcelLocation);
router.get('/parcels/count', admin, adminCtrl.countParcels);

export default router;
