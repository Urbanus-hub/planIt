import { Router } from "express";
import { createBooking, deleteBooking, getAllBookings, getUserBookings, getServiceBookings, getProviderBookings, updateBookingStatus} from "../controllers/bookings.controller.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = Router();



router.post('/',authorize,createBooking);
router.delete('/:id',authorize,deleteBooking);  
router.get('/',authorize,getAllBookings);
router.get('/user/:id',authorize,getUserBookings);
router.get('/service/:id',authorize,getServiceBookings);
router.get('/provider/:id',authorize,getProviderBookings);
router.patch('/:id',authorize,updateBookingStatus);

export default router;