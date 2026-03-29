import { Router } from "express";

const router = Router();

router.get('/', );
router.post('/', );
router.put('/:bookingId', );

export const bookingRouter = router;


/**
 * POST	/api/v1/bookings	Customer or Admin	Create booking with start/end dates
• Validates vehicle availability
• Calculates total price (daily rate × duration)
• Updates vehicle status to "booked"
GET	/api/v1/bookings	Role-based	Admin: View all bookings
Customer: View own bookings only
PUT	/api/v1/bookings/:bookingId
 */