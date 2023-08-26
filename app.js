const express= require('express')
const app=express()
const dotenv=require('dotenv')
const cors=require('cors')
const fileUpload = require("express-fileupload")
const connectdb=require('./db/connect_DB')
const web=require('./routes/web')



app.use(express.json())

dotenv.config({
    path:'.env'
})




app.use(fileUpload({useTempFiles: true}));

app.use(cors())


connectdb()
app.use('/api',web)
app.listen(process.env.PORT,()=>{
    console.log(`example app is listening on ${process.env.PORT}`)
})