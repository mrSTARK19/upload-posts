import jwt from "jsonwebtoken"

const authMID = (req,res,next)=>{
        let token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = decoded; // { id: userId }
            next();
        } catch (err) {
            console.log("JWT ERROR:", err.message);
            return res.status(401).json({ message: "Invalid token" });
        }
}

export default authMID;