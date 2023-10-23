const jwt = require("jsonwebtoken")

const verifyToken = async(req, res, next)=>{
    const token = req.headers.token;
    if(token){
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user)=>{
            if(err){
                res.status(403).json("Token is not valid")
            }
            req.user = user;
            next();
        });
    }
    else{
        res.status(401).json("You`re not authenticated")
    }
}

const verifyTokenAndAdminAuth = async (req, res, next) => {
  verifyToken(req, res, next , ()=>{
    if(req.user.id == req.parmas.id || req.user.admin){
        next();
    }else{
        res.status(403).json("You're not allowed to delete other")
    }

  }); 
};

module.exports = {
  verifyToken,
  verifyTokenAndAdminAuth,
};