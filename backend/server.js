import express from 'express';
import {PORT} from './configs/env.js';
import connectDB from './configs/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';





const app = express(); //express app instance

// middle wares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/users",userRoutes);//user routes


app.get('/', (req, res) => {
    res.send('API is running...');
});//basic route

app.listen(PORT || 5000, async() => {    
    console.log(`Server running at http://localhost:${PORT}`);
    connectDB();
});//spin server