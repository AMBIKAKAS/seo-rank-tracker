import jwt from "jsonwebtoken";

const auth = async(req,res,next) =>{
    try {
        
        const authHeader=req.header.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({sucess:false,message:"Not authorized, no token"});

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.userId = decoded.Id;
        next()

    } catch (error) {
        console.error("Aith middleware error:",error.message);
         return res.status(401).json({sucess:false,message:"Not authorized, no token"});
    }
}
export default auth;
