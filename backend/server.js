require("dotenv").config();
const app = require("./app");
const connectDB = require("./Config/Connection");
const PORT = process.env.PORT || 8000;

const startServer = async () =>{
    try{
        await connectDB();
        app.listen(PORT, () =>{
            console.log(`Server is running on port url: http://localhost:${PORT}`);
        });
    }
    catch(error){
        console.error("Error starting server:", error.message);
        process.exit(1);
    }
}

startServer();