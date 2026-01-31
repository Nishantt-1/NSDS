const express = require("express") ; 
const {authenticate} = require("../middleware/auth") ; 
const {getAllEvents} = require("../controllers/eventController") ;

const router = express.Router() ;

router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user }); // includes role
});

router.post("/addEve",authenticate,createEvent) ; 

router.get("/events",authenticate,getAllEvents) ;

module.exports = router ;

