

const express = require('express');
const userRouter = require('./routes/userRoutes')
const dotenv = require('dotenv')

const app = express();
const mongoose = require('mongoose')

dotenv.config()

app.use(express.json()) 

app.use('/users',userRouter)


app.get('/',(req,res)=>{

    res.send('hello')
})


mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    const port = process.env.PORT || 4500
    app.listen(port,()=>console.log(`server started on port no ${port}`));

})
.catch((error)=>{
    console.log(error)
})









