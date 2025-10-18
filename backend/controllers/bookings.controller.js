import Booking from "../models/bookings.model.js";
import Service from "../models/services.model.js";

export const createBooking = async (req, res) => {
  try {
    const user = req.user;
    const { serviceId, date, notes } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
   const userBookings= await Booking.find({user:req.user.id, service:serviceId, date:date});
   if(userBookings && userBookings.length>0){
    return res.status(400).json({message:"You have already booked this service for the selected date"});
   }

    // Ensure the service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = new Booking({
      user: req.user.id, // from authorize middleware
      service: service._id,
      provider: service.provider,
      date,
      notes,
      totalPrice: service.price,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//delete booking 

export const deleteBooking=async(req,res,next)=>{
  try{
    const booking=await Booking.findById(req.params.id);
    if(!booking) return res.status(404).json({message:"Booking not found"});
    if(booking.user.toString()!==req.user.id && req.user.role!=="admin"){
      return res.status(403).json({message:"Not authorized to delete this booking"});
    }       
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Booking deleted successfully"});
  }catch(err){
    res.status(500).json({error:err.message});
    next(err);
  } 
}
// get bookings for a user
export const getUserBookings=async(req,res,next)=>{
  try{
    const user=req.user;
    if(!user) return res.status(401).json({message:"Unauthorized"});
    const bookings=await Booking.find({user:req.params.id});
    res.status(200).json(bookings);
  }catch(err){
    res.status(500).json({error:err.message});
    next(err);
  }
};
// get bookings for a service
export const getServiceBookings=async(req,res,next)=>{
  try{
    const user=req.user;
    if(!user) return res.status(401).json({message:"Unauthorized"});
    const bookings=await Booking.find({service:req.params.id});
    res.status(200).json(bookings);
  }catch(err){
    res.status(500).json({error:err.message});
    next(err);
  }
};
// get bookings for a provider
export const getProviderBookings=async(req,res,next)=>{
  try{
    const user=req.user;
    if(!user) return res.status(401).json({message:"Unauthorized"});
    const bookings=await Booking.find({provider:req.params.id});
    res.status(200).json(bookings);
  }catch(err){
    res.status(500).json({error:err.message});
    next(err);
  }
};

// get all bookings (admin only)
export const getAllBookings=async(req,res,next)=>{  
    try{
        const user=req.user;
        if(!user) return res.status(401).json({message:"Unauthorized"});
        if(user.role!=="admin") return res.status(403).json({message:"Access denied"});
        const bookings=await Booking.find();
        if(!bookings || bookings.length===0) return res.status(404).json({message:"No bookings found"});
        res.status(200).json(bookings);
    }catch(err){
        res.status(500).json({error:err.message});
        next(err);
    }
};
// update booking status
export const updateBookingStatus=async(req,res,next)=>{
  try{
    const user=req.user;
    if(!user) return res.status(401).json({message:"Unauthorized"});
    const booking=await Booking.findById(req.params.id);
    if(!booking) return res.status(404).json({message:"Booking not found"});
    booking.status=req.body.status;
    await booking.save();
    res.status(200).json({message:"Booking status updated successfully", booking});
  }catch(err){
    res.status(500).json({error:err.message});
    next(err);
  }
};

//update booking
export const updateBooking=async(req,res,next)=>{
  try{
    const user=req.user;
    if(!user) return res.status(401).json({message:"Unauthorized"});
    const booking=await Booking.findById(req.params.id);
    if(!booking) return res.status(404).json({message:"Booking not found"});
    if(booking.user.toString()!==req.user.id && req.user.role!=="admin"){
      return res.status(403).json({message:"Not authorized to update this booking"});
    }
    Object.assign(booking, req.body);
    await booking.save();
    res.status(200).json({message:"Booking updated successfully", booking});
  }catch(err){
    res.status(500).json({error:err.message});
    next(err);
  }
};