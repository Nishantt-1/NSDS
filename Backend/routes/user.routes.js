const userController = require('../controllers/userController');
const express = require('express')  ; 

const router = express.Router() ; 

router.get('/:id',userController.getProfile) ; 
router.post('/:clubID/reqJoin',userController.requestToJoinClub) ; 

module.exports = router ; 



