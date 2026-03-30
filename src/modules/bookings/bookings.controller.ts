import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const payload = req.body;

        const result = await bookingsService.createBooking(payload);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong"
        });
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        const result = await bookingsService.getAllBookings(user);

        res.status(200).json({
            success: true,
            message:
                user.role === "admin"
                    ? "Bookings retrieved successfully"
                    : "Your bookings retrieved successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong"
        });
    }
};

const updateBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = Number(req.params.bookingId);
        const { status } = req.body;
        const user = req.user;

        const result = await bookingsService.updateBookingStatus(
            bookingId,
            status,
            user
        );

        res.status(200).json({
            success: true,
            message:
                status === "cancelled"
                    ? "Booking cancelled successfully"
                    : "Booking marked as returned. Vehicle is now available",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong"
        });
    }
};

export const bookingsController = {
    createBooking,
    getAllBookings,
    updateBooking
}