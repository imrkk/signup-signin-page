

const userModel = require('../models/user')
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken') 


const SECRET_KEY = process.env.SECRET_KEY


const signup = async(req,res)=>{

    const {username,email,password} = req.body;

    try{
        //Existing user
        const existingUser = await userModel.findOne({email:email})    

        if(existingUser){
                return res.status(400).json({message: "User already exist"})
        }

        //Create Hashed Password
        const hashedPassword = await bcrypt.hash(password,10);
          
        //Create User
         const result = await userModel.create({
                   
                    email: email, 
                    password: hashedPassword,                            
                    username:username
        })

       //Create jwt
        const token = jwt.sign({email: result.email, id: result._id},SECRET_KEY)

        res.status(201).json({user:result,token:token})
     
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Something went wrong"})

    }     

}





const signin = async(req,res)=>{

    const {email,password} = req.body;

    try{

        //1.Existing user
        const existingUser = await userModel.findOne({email:email})

        if(!existingUser){
        return res.status(404).json({message: "User Not Found"})
    }

        //2. password
        const matchPassword = await bcrypt.compare(password,existingUser.password)
                                   

        if(!matchPassword)                            {
            return res.status(400).json({message: "Invalid Credentials"});
        }


        //3. token
        const token = jwt.sign({email: existingUser.email, id: existingUser._id},SECRET_KEY)

        res.status(200).json({user:existingUser,token:token})
        
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Something went wrong"})
    }

}



module.exports = {signup,signin}





