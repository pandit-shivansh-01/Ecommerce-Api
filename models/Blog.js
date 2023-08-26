const mongoose =require('mongoose')

// define schema 
const blogSchema=new mongoose.Schema({
    // image:    
    // {
    //   public_id: {
    //     type: String,
        
    //   },
    //   url: {
    //     type: String,
         
    //   },
    // },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true})


// create collection             
const BlogModel= mongoose.model('blog',blogSchema)
//                                ^ collection name  


module.exports=BlogModel
