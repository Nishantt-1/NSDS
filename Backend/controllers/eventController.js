const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    const token=req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role=="ORGANIZER"){    
            const { title, collaboratingClubs, budget, startTime, endTime } = req.body;

            const event = await Event.create({
                title, collaboratingClubs, budget, startTime, endTime,
                creator: req.user.id,
                status: 'PENDING' // Moves to Admin for approval
            });
            res.status(201).json(event);
        }
        else{
            res.status(202).json( {message : "Not Authorize"})
        }
        
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }

    
};

exports.approveEvent = async (req, res) => {
    const token=req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }


    try{
       const decoded= jwt.verify(token, process.env.JWT_SECRET);
       if(decoded.role=="ADMIN"){
            const event = await Event.findByIdAndUpdate(req.params.id, { status: 'APPROVED' }, { new: true });
            res.json(event);
       } 
       else{
            res.status(202).json({message:"Not Authorize"})
       }

    }
    catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }

    
};

