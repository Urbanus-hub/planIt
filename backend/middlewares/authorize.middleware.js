import jwt from "jsonwebtoken"
import {JWT_SECRET} from '../configs/env.js'
const authorize=async(req,res,next)=>{
    console.log(`authorize middleware for method ${req.method} at ${req.originalUrl}`);
    try{
        const token=req.headers.authorization?.split(" ")[1] || req.cookies.token;
        if(!token) return res.status(401).json({message:"Not authorized, no token"});
        const decoded=jwt.verify(token,JWT_SECRET);
        if(!decoded) return res.status(401).json({message:"Not authorized, token failed"});
        req.user=decoded;
        console.log("User authorized:",req.user);
    next()
    }catch(err){
        return res.status(401).json({message:"Not authorized"}); 
        next(err);   
    }
}    
export default authorize;     