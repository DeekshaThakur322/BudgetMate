import "dotenv/config";
import app from "./app.js";
import { db } from "./db.js";

const PORT = process.env.PORT || 5000;



console.log("PORT:", process.env.PORT);
console.log("MONGODB_URL exists:", !!process.env.MONGODB_URL);


const startServer = async () => {
    try {
        await db();

        app.listen(PORT,"0.0.0.0",() => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Server failed to start:", error.message);
    }
};

startServer();