import app from "./app"
import config from "./config";


const PORT = config.port;
const bootstrap = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is Running on port : ${PORT}`);
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

bootstrap();