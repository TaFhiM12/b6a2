import app from "./app"
import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT;
const startServer = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is Running on port : ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();