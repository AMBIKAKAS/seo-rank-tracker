import User from "../models/user";
import  bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const generateToken =  (id)=>{

return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"30"})
}



//register user
export const register = async(req,res) => {
    try {
        const {name,email,password}=req.body;

        if(!name,!password,!email) return res.status(400).json({success:"false",message:"all fields are required"});

        //check if user exists
         
        const existingUser= await User.findOne({email})

         if(existingUser) return res.status(400).json({success:"false",message:"user exists"});

         //hash passwords
         const hashedPassword = await bcrypt.hash(passwords,await bcrypt.genSalt(10))

         //create user
         const User= await User.create({name,email,password: hashedPassword})

         //token generation 
         const Token = generateToken(user._id);

         res.status(201).json({success:true,token,user})

    } catch (error) {
        console.error("Registor error:",error.message)
        res.status(500).json({success:false,message:"server error"})
        
    }
}

//Login user

export const login = async(req,res) => {
    try {
        const {email,password}=req.body;

        if(!email || !password) return res.status(400).json({success:"false",message:"all fields are required"});

      //find user
         
        const user= await User.findOne({email})

         if(user) return res.status(400).json({success:"false",message:"Invalid credentials"});

         //check password
         const  isMatch =await bcrypt.compare(password,user.password)
         if (!isMatch)return res.status(400).json({success:"false",message:"Invalid credentials"});

         //create user
         const User= await User.create({name,email,password: hashedPassword})

         //token generation 
         const Token = generateToken(user._id);

         res.status(201).json({success:true,token,user})

    } catch (error) {
        console.error("Login error:",error.message)
        res.status(500).json({success:false,message:"server error"})
        
    }
}
//get current user
export const getUser = async(req,res) => {
    try {
    
         
        const user= await User.findByID(req.userID).select("-password");


         if(!user){ return res.status(400).json({success:"false",message:"User not found"});}

 res.josn({success:"true",user})
    } 
   
    catch (error) {
        console.error("Get user error:",error.message)
        res.status(500).json({success:false,message:"server error"})
        
    }
}