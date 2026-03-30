import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const vehicle = await vehiclesService.createVehicle(req.body);

        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: vehicle
        });

    } catch (error: any) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message || "Failed to create vehicle"
        });
    }
};

const getVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await vehiclesService.getVehicles();

        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: vehicles
        });

    } catch (error: any) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve vehicles"
        });
    }
};
const getVehicleById = async (req: Request, res: Response) => {
    const vehicleId = parseInt(req.params.vehicleId as string);
    if (!vehicleId) {
        return res.status(400).json({
            success: false,
            message: "Invalid vehicle ID"
        });
    }

    try {
        const vehicle = await vehiclesService.getVehicleById(vehicleId);

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: {
                id: vehicle.id,
                vehicle_name: vehicle.vehicle_name,
                type: vehicle.type,
                registration_number: vehicle.registration_number,
                daily_rent_price: vehicle.daily_rent_price,
                availability_status: vehicle.availability_status
            }
        });

    } catch (error: any) {
        console.error(error);

        res.status(404).json({
            success: false,
            message: error.message || "Vehicle not found"
        });
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const vehicleId = parseInt(req.params.vehicleId as string);
        const result = await vehiclesService.updateVehicle(vehicleId, req.body);
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: result
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const vehicleId = parseInt(req.params.vehicleId as string);

        await vehiclesService.deleteVehicle(vehicleId);

        res.status(200).json({
            "success": true,
            "message": "Vehicle deleted successfully"
        });
    } catch (err: any) {
        console.error(err);

        res.status(400).json({
            success: false,
            message: err.message || "Something went wrong"
        });
    }
}

export const vehiclesController = {
    createVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};