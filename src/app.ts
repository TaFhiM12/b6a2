import express, { Request, Response } from 'express';
import cors from 'cors'
import { userRouter } from './modules/users/user.router';
import { vehicleRouter } from './modules/vehicles/vehicles.router';
import { bookingRouter } from './modules/bookings/bookings.router';
import { authRouter } from './modules/auth/auth.router';
import initDB from './config/db';

const app = express();
initDB();


app.use(express.json());
app.use(cors());

//
// app.use('/api/v1/vehicles', vehicleRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Assignment 2 server running');
})

export default app;
