const handleGlobalError = (err, _req, res, next) => {
    console.error("Global error handler:", err);
    // If headers already sent, delegate to default Express handler
    if (res.headersSent) {
        next(err);
        return;
    }
    const env = process.env.NODE_ENV || "development";
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    // Mongo / Mongoose: duplicate key (e.g. unique index)
    if (err.code === 11000) {
        statusCode = 400;
        const keys = Object.keys(err.keyValue || {});
        message = `Duplicate field value${keys.length ? `: ${keys.join(", ")}` : ""}. Please use another value.`;
    }
    // Mongoose validation errors
    else if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors || {}).map((e) => e.message);
        message = errors.join("; ");
    }
    // Mongoose cast error (invalid ObjectId or wrong type)
    else if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }
    // JWT errors
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please log in again.";
    }
    else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired. Please log in again.";
    }
    // Bad JSON payload (body parser)
    else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        statusCode = 400;
        message = "Malformed JSON in request body.";
    }
    const payload = {
        status: statusCode >= 500 ? "error" : "fail",
        statusCode,
        message,
    };
    // Add verbose debug info when not in production
    if (env !== "production") {
        payload.errorName = err.name;
        payload.stack = err.stack;
        if (err.code)
            payload.code = err.code;
        if (err.keyValue)
            payload.keyValue = err.keyValue;
    }
    res.status(statusCode).json(payload);
};
export default handleGlobalError;
//# sourceMappingURL=globalErrorsHandler.middleware.js.map