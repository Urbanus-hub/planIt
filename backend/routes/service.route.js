import { Router } from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/service.controller.js';
import authorize from '../middlewares/authorize.middleware.js'
const router=Router();



router.post('/create-service',authorize, createService);
router.get('/',authorize, getServices);
router.get('/:id',authorize, getServiceById);
router.patch('/:id',authorize, updateService);
router.delete('/:id',authorize, deleteService);









export default router;