import express, { Request, Response } from "express";
import { PORT } from "./configs/env";
import connectDB from "./configs/db";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import handleGlobalError from "./middlewares/globalErrorsHandler.middleware";
import servicesRouter from "./routes/service.route";
import BookingRouter from "./routes/bookings.route";

const app = express(); // express app instance

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/users", userRoutes); // user routes
app.use("/api/services", servicesRouter);
app.use("/api/bookings", BookingRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({message:"API is running..."});
}); // basic route

// global error handler
app.use(handleGlobalError);

// spin server
const port = PORT || 5000;
app.listen(port, async () => {
    await connectDB();
  console.log(`Server running at http://localhost:${port}`);
});
