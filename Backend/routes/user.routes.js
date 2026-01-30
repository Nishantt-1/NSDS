const userController = require('../controllers/userController');
const express = require('express')  ; 

const {authenticate,authorize} = require('../middleware/auth');
const router = express.Router() ; 

router.get('/me',authenticate,authorize(['ADMIN','ORGANIZER','PARTICIPANT']),userController.getMyProfile) ; 
router.post('/:clubID/reqJoin',authenticate,authorize(['PARTICIPANT','ORGANIZER']),userController.requestToJoinClub) ; 



module.exports = router ; 



