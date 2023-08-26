const UserModel=require('../models/User')
const bcrypt= require('bcrypt')  // for making hash password
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'dwkppmaym',
    api_key: '359479626141935',
    api_secret: 'Q70MRVgOb7RKsAbWOZw5gYCUKWE',
    secure: false
});

class UserController{
    static userregister=async(req,res)=>{
        try{


            const file = req.files.image
            const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'api_image'
            })
            console.log(req.body)
            const {name,email,password,cpassword}=req.body
            const user = await UserModel.findOne({email:email})
            if(user)
            {
                res.status(401).json({
                    message:'Email already exists'
        
                })
        
            }
            else{
                if(name && email && password && cpassword)
                {
                    if(password == cpassword)
                    {
                        try{
                            const hashpassword= await bcrypt.hash(password,10)
                            const result=new UserModel({
                                name:name,
                                email:email,
                                password:hashpassword,
                                image: {
                                    public_id: myimage.public_id,
                                    url: myimage.secure_url
                
                                }
                            })
                            await result.save()
                            res.status(201).json({
                                message:'Registration Successful :)',
                                result
                    
                            })
                        }catch(err){
                            console.log(err)
                        }
                    }
                    else{
                        res.status(401).json({
                            message:'password and confirm password doesnt match'
                
                        })
                    }
                }
                else{
                    res.status(401).json({
                        message:'All fields are required'
            
                    })
                }
            }
        }catch(err)
        {
            console.log(err)
        }
    }

    static verifylogin =async(req,res)=>{

        try{
          //console.log(req.body)
          const {email,password} =req.body
          if(email && password){
            const user = await UserModel.findOne({email:email})
            if(user != null){
              const ismatched = await bcrypt.compare(password,user.password)
              if(ismatched ){
                const token=jwt.sign({id:user._id},'shivanshpandey2002')
                // console.log(token)
                res.cookie('token',token)
                res.status(201).json({
                    status:201,
                    message:'Login Sucessful with web token',
                    token:token,
                    user
        
                })
    
              }
              else{
                res.status(401).json({
                    message:'Email or password doesnt match'
        
                })
              }
            } 
            else{
                res.status(401).json({
                    message:'not a registered user'
        
                })
            }
    
          }
          else{
            res.status(401).json({
                message:'All fields are required'
    
            })
          }
        }
        catch(err){
          res.send(err)
        }
      }
      static View = async(req,res)=>{

        const view = await userModel.findById(req.params.id)
        res.status(200).json({
            success: true,
            view,
        });
    }
    static GetAllUser = async(req,res)=>{
        const users = await UserModel.find()
        //console.log(user)
        res.status(200).json({
            success: true,
            users,
        });
    }
    static logout = async (req, res) => {
        try {
            res.clearCookie("token");
            res.send('logout successfully');
        } catch (error) {
            console.log("error");
        }
    };

    static getuserdetail = async (req, res) => {
        try {
            //console.log(req.user);
            const user = await userModel.findById(req.user.id);

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            console.log(error);
        }
    }

    static change_password = async (req, res) => {
        try {
            const { name, email, id, image } = req.user
            // console.log(req.body)
            const { oldpassword, newpassword, cpassword } = req.body
            if (oldpassword && newpassword && cpassword) {
                const user = await UserModel.findById(id)
                const ismatch = await bcrypt.compare(oldpassword, user.password)
                if (!ismatch) {
                    
                    res.status(400)
                .json({ status: "Failed", message: "Old Password is incorrect" });
                }
                else {
                    if (newpassword !== cpassword) {
                        
                        res.status(400)
                        .json({ status: "Failed", message: "Password and confirm password is not matched" });
                    }
                    else {
                        const newHashpassword = await bcrypt.hash(newpassword, 10)
                        await UserModel.findByIdAndUpdate(id, {
                            $set: { password: newHashpassword }

                        })
                       
                        res.status(201)
                        .json({ status: "Success", message: "Password Change successfully" });
                    }
                }

            }
            else {
                res.status(400)
                .json({ status: "Failed", message: "All field are required" });

            }


        } catch (error) {
            console.log('error')
        }
    }

    static profile_update = async (req, res) => {
        try {
            //console.log(req.files.image)
            if (req.files) {
                const user = await UserModel.findById(req.user.id);
                const image_id = user.image.public_id;
                await cloudinary.uploader.destroy(image_id);

                const file = req.files.image;
                const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: "studentimage",

                });
                var data = {
                    name: req.body.name,
                    email: req.body.email,
                    image: {
                        public_id: myimage.public_id,
                        url: myimage.secure_url,
                    },
                };
            } else {
                var data = {
                    name: req.body.name,
                    email: req.body.email,

                }
            }
            const update_profile = await UserModel.findByIdAndUpdate(req.user.id, data)
            res.status(201)
            .json({ status: "Success", message: "Profile Update successfully" });
        } catch (error) {
            console.log(error)
        }
    }

    static sendEmail = async (name, email) => {
        // console.log("email sending")
        //consollog("propertyName")
        // console.log(email)

        //connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "sujaljha007@gmail.com",
                pass: "uqltlwovtuaovloc",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Create course Registration Succesfully", // Subject line
            text: "hello", // plain text body
            html: `<b>${name}</b> Registration is successful! please login.. `, // html body
        });
        //console.log("Messge sent: %s", info.messageId);
    };
}
module.exports=UserController