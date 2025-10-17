import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {NODE_ENV,JWT_SECRET} from '../configs/env.js';

export const registerUser = async (req, res,next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    // don't return password in response
    const { password: _, ...userData } = user.toObject();
    res.status(201).json({
        message: "User registered successfully",data:userData});
  } catch (err) {
    res.status(500).json({ error: err.message });
    next(err);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

   

    // // set HttpOnly cookie (safer for browsers)
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: NODE_ENV === "production", // set to true in production
    //   sameSite: "lax", // adjust if cross-site
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // });

    res.status(200).send({ message: "Login successful", user: { id: user._id, name: user.name, role: user.role } ,token});
  } catch (err) {
    res.status(500).json({ error: err.message });
    next(err);
  }
};

// fetch users
export const getUsers=async (req,res,next)=>{
  const user=req.user;
  console.log("Get users requested by:",user);
  try{
    if(!user){
      return res.status(401).json({message:"Unauthorized"});
    }
    if(user.role!=="admin"){
      return res.status(403).json({message:"Access denied"});
    }
    const users= await User.find(); 
    if(!users){
     return res.status(404).json({message:"No users found"})
    }
  return res.status(200).send(users);

  }catch(err){
    console.log(err.message)
    next(err);

  }
}

export const getUser=async(req,res,next)=>{
  const user=req.user;
  try{
      if(!user.role==="admin"){
          res.status(403).json({message:"Access denied"});
      }
      const fetchedUser=await User.findById(req.params.id);
      
      if(!fetchedUser){
          res.status(404).json({message:"User not found"});
      }
      res.status(200).json(fetchedUser);
  }catch(err){
      res.status(500).json({error:err.message});
      next(err);
  } 
}

// delete user

export const deleteUser=async(req,res,next)=>{
  try{
    const user=req.user;
    if(user.role!=="admin") return res.status(403).json({message:"Access denied"});
    const fetchedUser=await User.findById(req.params.id);
    if(!fetchedUser) return res.status(404).json({message:"User not found"}); 
    if(fetchedUser.role==="admin") return res.status(400).json({message:"Cannot delete admin user"});
    const deletedUser=await User.findByIdAndDelete(req.params.id);
  if(!deletedUser) return res.status(404).json({message:"User not found"});
  res.status(200).json({message:"User deleted successfully"});
  }catch(err){
    res.status(500).json({error:err.message});
    next(err);

  }
}
