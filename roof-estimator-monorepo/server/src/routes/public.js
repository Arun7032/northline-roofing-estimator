import { Router } from 'express';
import { getPublicConfig } from '../controllers/configController.js';
import { createEstimate } from '../controllers/estimateController.js';
const router = Router();
router.get('/config', getPublicConfig);
router.post('/estimate', createEstimate);
export default router;
