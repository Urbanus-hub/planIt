import Service from "../models/services.model.js";
/**
 * Verify that the user owns the service or is an admin
 */
export const verifyServiceOwnership = async (req, res, next) => {
    try {
        const user = req.user;
        const serviceId = req.params.id;
        // Admins can access any service
        if (user.role === "admin") {
            next();
            return;
        }
        const service = await Service.findById(serviceId);
        if (!service) {
            res.status(404).json({
                success: false,
                message: "Service not found.",
            });
            return;
        }
        if (service.provider.toString() !== user.id) {
            res.status(403).json({
                success: false,
                message: "Access denied. You can only modify your own services.",
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error verifying service ownership.",
        });
    }
};
//# sourceMappingURL=serviceAuthorization.js.map