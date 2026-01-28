const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { name, email, password, role, department, year } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role, department, year });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.cookie('token',token) ; 
    res.status(201).json({ message: "User created" });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.cookie('token',token) ; 
        res.json({ token, user: { name: user.name, role: user.role } });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
};

exports.logout = async(req,res) => {
    res.clearCookie('token') ;
    res.json({message : "Logged out successfully"}) ;
    
}