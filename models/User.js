const mongoose =require('mongoose')

// define schema 
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:    
    {
      public_id: {
        type: String,
        
      },
      url: {
        type: String,
         
      },
    },
},{timestamps:true})


// create collection             
const UserModel= mongoose.model('user',userSchema)
//                                ^ collection name  


module.exports=UserModel
