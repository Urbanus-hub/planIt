import dotenv from 'dotenv';
dotenv.config({path:`.env.${process.env.NODE_ENV || 'development'}.mode`});
export const{PORT,MONGO_URI,JWT_SECRET,NODE_ENV}=process.env;