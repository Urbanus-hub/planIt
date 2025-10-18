
import Service  from "../models/services.model.js";
// create a service
const createService = async (req, res, next) => {
    
    try {
      const creator=req.user;
    if(creator.role !== "vendor" && creator.role !=="admin"){
      return res.status(403).json({ message: "Forbidden" });
    }
  const { title, category, description, price, location, image } = req.body;
  if(!title || !category || !description || !price || !location){
    return res.status(400).json({message:"Missing required fields"});
  }
  const providerId = req.user.id; // from authorize middleware
 const service =await Service.create({
    title,
    category,
    description,
    price,
    location,
    image,
    provider: providerId,
  });
  if(!service){
    return res.status(400).json({message:"Service creation failed"})
  }
  res.status(201).json({ message: "Service created successfully", service });
} catch (err) {
  res.status(500).json({ error: err.message });
  next(err);
}};
// get all services
const getServices = async (req, res, next) => {
  try {
    if(!req.user){
      return res.status(401).json({ message: "Unauthorized" });
    }
    const services = await Service.find();
    if(!services || services.length===0){
      return res.status(404).json({message:"No services found"})
    }
    res.status(200).json({ services });
    } catch (err) {
    res.status(500).json({ error: err.message });
    next(err);
  }
};
// get service by userID

// get a service by id
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ service });
    } catch (err) {
    res.status(500).json({ error: err.message });
    next(err);
  }
};
// update a service
const updateService = async (req, res, next) => {
  
  try {
    const updater=req.user;   
  if(!updater){
    return res.status(401).json({message:"Unauthorized"});
  }
  if(updater.role!=="vendor" && updater.role!=="admin"){
    return res.status(403).json({message:"Forbidden"});
  }
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { $set: req.body, new: true});
    res.status(200).json({ message: "Service updated successfully", service: updatedService });
  } catch (err) {
    res.status(500).json({ error: err.message });
    next(err);
  }
};
// delete a service
const deleteService = async (req, res, next) => {
    try{
        if(req.user.role!=="vendor" && req.user.role!=="admin"){
            return res.status(403).json({message:"Not authorized"});
        }
    const service = await Service.findById(req.params.id);
    if(!service){
        return res.status(404).json({message:"Service not found"});
    }
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if(!deletedService){
        return res.status(400).json({message:"Service deletion failed"});
    }
    res.status(200).json({message:"Service deleted successfully", service: deletedService});
    
    }catch(err){
        res.status(500).json({error:err.message});
        next(err);
    };
};
export{
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};