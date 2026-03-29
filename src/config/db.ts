import { Pool } from 'pg'
import config from '.'

export const pool = new Pool({
    connectionString: `${config.connection_str}`,
})

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(200) UNIQUE NOT NULL,
            password TEXT NOT NULL CHECK(length(password) >= 6),
            phone VARCHAR(20) NOT NULL,
            role VARCHAR(20) CHECK(role IN ('admin', 'customer')) NOT NULL DEFAULT 'customer',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(50) NOT NULL,
            type VARCHAR(50) CHECK(type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
            registration_number VARCHAR(100) NOT NULL UNIQUE,
            daily_rent_price INT NOT NULL CHECK(daily_rent_price >= 0),
            availability_status VARCHAR(10) CHECK(availability_status IN ('available','booked')) NOT NULL DEFAULT 'available',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL CHECK(rent_end_date >= rent_start_date),
            total_price INT NOT NULL CHECK(total_price >= 0),
            status VARCHAR(20) CHECK(status IN ('active','cancelled','returned')) NOT NULL DEFAULT 'active',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
}

export default initDB;

