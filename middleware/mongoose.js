const { default: mongoose } = require("mongoose");

const connectDb = handler => async (req,res) => {
    if (mongoose.connections[0].readyState) {
        console.log("Database already connected");
        return handler(req, res);
    }
    
    console.log("Connecting to the database...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
    
    return handler(req, res);
};

export default connectDb;
