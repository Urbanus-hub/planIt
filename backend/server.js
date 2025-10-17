import express from 'express';
import {PORT} from './configs/env.js';
import connectDB from './configs/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import handleGlobalerror from './middlewares/globalErrorsHandler.middleware.js';
import servicesRouter from './routes/service.route.js';
import BookingRouter from './routes/bookings.route.js'




const app = express(); //express app instance

// middle wares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


// routes
app.use("/api/users",userRoutes);//user routes
app.use("/api/services",servicesRouter);
app.use("/api/bookings",BookingRouter);



app.get('/', (req, res) => {
    res.send('API is running...');
});//basic route

// global error handler
app.use(handleGlobalerror);

//spin server
app.listen(PORT || 5000, async() => {    
    console.log(`Server running at http://localhost:${PORT}`);
    connectDB();
});