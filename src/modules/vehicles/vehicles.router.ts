import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get('/', vehiclesController.getVehicles);
router.get('/:vehicleId', vehiclesController.getVehicleById);
router.post('/', auth(true), vehiclesController.createVehicle);
router.put('/:vehicleId', auth(true), vehiclesController.updateVehicle);
router.delete('/:vehicleId', auth(true), vehiclesController.deleteVehicle);


export const vehicleRouter = router;