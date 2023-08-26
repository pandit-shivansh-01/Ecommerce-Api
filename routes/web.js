const express=require('express')
const BlogController = require('../controllers/BlogController')
const UserController = require('../controllers/UserController')
const checkuserauth = require('../middleware/auth')
const router=express.Router()

// ============ blogcontroller===============
router.post('/create',BlogController.create)
router.get('/display',BlogController.display)
router.get('/view/:id',BlogController.view)
router.post('/update/:id',BlogController.update)
router.delete('/delete/:id',BlogController.delete)






// ========================= user controller =======================
router.post('/register',UserController.userregister)
router.post('/login',UserController.verifylogin)
router.get('/getalluser',UserController.GetAllUser)
router.get('/view/:id',UserController.View)
router.get('/me',checkuserauth,UserController.getuserdetail)
router.post('/updatepassword',checkuserauth,UserController.change_password)
router.post('/updateprofile',checkuserauth,UserController.profile_update)
router.get('/',UserController.logout)





module.exports=router