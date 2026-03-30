import { pool } from "../../config/db";

interface IBooking{
    customer_id: number;
    vehicle_id: number;
    rent_start_date: Date;
    rent_end_date: Date;
    status?: string;
}

const createBooking = async (payload: IBooking) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, status } = payload;
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const vehicleRes = await pool.query(
        `SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1`,
        [vehicle_id]
    );
    if (vehicleRes.rowCount === 0) {
        throw new Error("Vehicle not found");
    }
    const vehicle = vehicleRes.rows[0];
    if (vehicle.availability_status !== "available") {
        throw new Error("Vehicle is not available");
    }
    const total_price = diffDays * vehicle.daily_rent_price;
    const result = await pool.query(
        `INSERT INTO bookings 
        (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            total_price,
            status || "active"
        ]
    );

    await pool.query(
        `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
        [vehicle_id]
    );
    const data = result.rows[0];

    return {
        id: data.id,
        customer_id: data.customer_id,
        vehicle_id: data.vehicle_id,
        rent_start_date: data.rent_start_date,
        rent_end_date: data.rent_end_date,
        total_price: data.total_price,
        status: data.status,
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }
    };
};

const getAllBookings = async (user: any) => {
    if (user.role === "admin") {
        const result = await pool.query(`
            SELECT 
                b.id, b.customer_id, b.vehicle_id,
                b.rent_start_date, b.rent_end_date,
                b.total_price, b.status,
                u.name, u.email,
                v.vehicle_name, v.registration_number
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
            ORDER BY b.created_at DESC
        `);

        // ✅ Format response
        return result.rows.map((row) => ({
            id: row.id,
            customer_id: row.customer_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            customer: {
                name: row.name,
                email: row.email
            },
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number
            }
        }));
    }

    // ✅ Customer: see only own bookings
    else {
        const result = await pool.query(
            `
            SELECT 
                b.id, b.vehicle_id,
                b.rent_start_date, b.rent_end_date,
                b.total_price, b.status,
                v.vehicle_name, v.registration_number, v.type
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.customer_id = $1
            ORDER BY b.created_at DESC
            `,
            [user.id]
        );

        return result.rows.map((row) => ({
            id: row.id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
                type: row.type
            }
        }));
    }
};

const updateBookingStatus = async (
    bookingId: number,
    status: string,
    user: any
) => {
    const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id = $1`,[bookingId]);

    if (bookingRes.rowCount === 0) {
        throw new Error("Booking not found");
    }
    const booking = bookingRes.rows[0];
    if (user.role === "customer") {
        if (booking.customer_id !== user.id) {
            throw new Error("Unauthorized");
        }

        if (status !== "cancelled") {
            throw new Error("Customers can only cancel bookings");
        }
    }

    if (user.role === "admin") {
        if (status !== "returned") {
            throw new Error("Admin can only mark as returned");
        }
    }

    const updatedRes = await pool.query(
        `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [status, bookingId]
    );

    const updatedBooking = updatedRes.rows[0];
    if (status === "cancelled" || status === "returned") {
        await pool.query(
            `UPDATE vehicles SET status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
        );
    }
    if (status === "returned") {
        return {
            ...updatedBooking,
            vehicle: {
                availability_status: "available"
            }
        };
    }

    return updatedBooking;
};

export const bookingsService = {
    createBooking,
    getAllBookings,
    updateBookingStatus
}