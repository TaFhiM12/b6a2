import { pool } from "../../config/db";

export type VehicleType = 'car' | 'bike' | 'van' | 'SUV';
export type AvailableType = 'available' | 'booked';

export interface IVehicle {
    vehicle_name: string;
    type: VehicleType;
    registration_number: string;
    daily_rent_price: number;
    availability_status?: AvailableType;
}

const createVehicle = async (payload: IVehicle) => {
    const {
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status
    } = payload;

    if (!vehicle_name || !type || !registration_number || daily_rent_price === undefined) {
        throw new Error("All required fields must be provided");
    }
    if (daily_rent_price < 0) {
        throw new Error("Price cannot be negative");
    }
    const status = availability_status || 'available';
    const result = await pool.query(
        `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
         VALUES ($1, $2, $3, $4, $5) RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status`,
        [vehicle_name, type, registration_number, daily_rent_price, status]
    );
    return result.rows[0];
};

const getVehicles= async () => {
    const result = await pool.query(`
        SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status 
        FROM vehicles
        ORDER BY id DESC
    `);

    return result.rows;
};

const getVehicleById = async (vehicleId: number) => {
    const result = await pool.query(`
        SELECT id, vehicle_name, type, registration_number, daily_rent_price, availability_status 
        FROM vehicles
        WHERE id = $1
    `, [vehicleId]);

    if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    return result.rows[0];
};

const updateVehicle = async(vehicleId: number, data: any) => {
    const temp = ["vehicle_name", "type", "registration_number", "daily_rent_price", "availability_status"];
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;
    for(const key in data){
        if(temp.includes(key)){
            fields.push(`${key} = $${index}`)
            values.push(data[key]);
            index++;
        }
    }

    if(fields.length === 0){
        throw new Error("No valid fields provided");
    }

    const query = `update vehicles set ${fields.join(", ")} where id = ${vehicleId} returning id, vehicle_name, type, registration_number, daily_rent_price, availability_status`;
    const result = await pool.query(query,values);
     if (result.rows.length === 0) {
        throw new Error("Vehicle not found");
    }

    return result.rows[0];
}
/**
 * id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(50) NOT NULL,
            type VARCHAR(50) CHECK(type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
            registration_number VARCHAR(100) NOT NULL UNIQUE,
            daily_rent_price INT NOT NULL CHECK(daily_rent_price >= 0),
            availability_status VARCHAR(10) CHECK(availability_status IN ('available','booked')) NOT NULL DEFAULT 'available',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
 */

export const vehiclesService = {
    createVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle
};