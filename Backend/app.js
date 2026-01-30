const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const cors =   require('cors');
require("./models"); 

const app = express() ; 
app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))
app.use(cookieParser());
app.use(express.json());

app.get("/",(req,res) => {
    res.send("NSDS Backend is running")
})


app.use("/api/auth", authRoutes);   
app.use("/api/users", userRoutes);

module.exports = app;
