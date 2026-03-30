import cron from "node-cron";
import { pool } from "../config/db";

cron.schedule("0 0 * * *", async () => {
    try {
        const expiredBookings = await pool.query(`
            SELECT id, vehicle_id
            FROM bookings
            WHERE rent_end_date < CURRENT_DATE
            AND status = 'active'
        `);

        if (expiredBookings.rows.length === 0) {
            console.log("No expired bookings found");
            return;
        }
        const bookingIds = expiredBookings.rows.map(b => b.id);
        const vehicleIds = expiredBookings.rows.map(b => b.vehicle_id);
        await pool.query(`
            UPDATE bookings
            SET status = 'returned'
            WHERE id = ANY($1)
        `, [bookingIds]);
        await pool.query(`
            UPDATE vehicles
            SET availability_status = 'available'
            WHERE id = ANY($1)
        `, [vehicleIds]);


    } catch (error) {
        console.error( error);
    }
});