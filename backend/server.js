console.time("Server starting");
console.time("Variables loaded");
require("dotenv").config();
console.timeEnd("Variables loaded");
const app = require("./app");
const connectDB = require("./Config/Connection");
const PORT = process.env.PORT || 8000;

const startServer = async () =>{
    try{
        console.time("DB Connection");
        await connectDB();
        console.timeEnd("DB Connection");
        app.listen(PORT, () =>{
            console.log(`Server is running on port url: http://localhost:${PORT}`);
        });
        console.timeEnd("Server starting");
    }
    catch(error){
        console.error("Error starting server:", error.message);
        process.exit(1);
    }
}

startServer();