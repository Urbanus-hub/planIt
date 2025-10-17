import mongoose from "mongoose";
import { MONGO_URI,NODE_ENV} from "./env.js";

const connectDB = async () => {     
    try{
        await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected in ${NODE_ENV} mode`);
        
    }catch(error){
        console.error(`Error connecting to db: ${error.message}`);
        process.exit(1);//1 means there was an error 
    }
};

export default connectDB;