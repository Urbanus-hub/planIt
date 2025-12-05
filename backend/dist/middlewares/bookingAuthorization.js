import Booking from "../models/bookings.model";
/**
 * Verify that the user owns the booking or is an admin
 */
export const verifyBookingOwnership = async (req, res, next) => {
    try {
        const user = req.user;
        const bookingId = req.params.id;
        // Admins can access any booking
        if (user.role === "admin") {
            next();
            return;
        }
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            res.status(404).json({
                success: false,
                message: "Booking not found.",
            });
            return;
        }
        // User must be the booking creator
        if (booking.user.toString() !== user.id) {
            res.status(403).json({
                success: false,
                message: "Access denied. You can only access your own bookings.",
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error verifying booking ownership.",
        });
    }
};
/**
 * Verify that the user is the provider of the booking service or admin
 * Used for updating booking status (confirm, complete, etc.)
 */
export const verifyProviderAccess = async (req, res, next) => {
    try {
        const user = req.user;
        const bookingId = req.params.id;
        // Admins can access any booking
        if (user.role === "admin") {
            next();
            return;
        }
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            res.status(404).json({
                success: false,
                message: "Booking not found.",
            });
            return;
        }
        // Check if user is the provider or the booking creator
        const isProvider = booking.provider.toString() === user.id;
        const isBookingOwner = booking.user.toString() === user.id;
        if (!isProvider && !isBookingOwner) {
            res.status(403).json({
                success: false,
                message: "Access denied. You don't have permission to modify this booking.",
            });
            return;
        }
        // Attach additional info to request for controller
        req.body.isProvider = isProvider;
        req.body.isBookingOwner = isBookingOwner;
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error verifying provider access.",
        });
    }
};
//# sourceMappingURL=bookingAuthorization.js.map