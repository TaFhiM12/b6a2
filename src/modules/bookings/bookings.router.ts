import { Router } from "express";
import { bookingsController } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get('/', auth(), bookingsController.getAllBookings);
router.post('/', auth(), bookingsController.createBooking);
router.put('/:bookingId', auth(), bookingsController.updateBooking);

export const bookingRouter = router;
