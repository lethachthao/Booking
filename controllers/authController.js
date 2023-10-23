const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const ModelUser = require("../models/User")


let refreshTokens = []

///////////////////////Register//////////////////////

      const registerUser =  async (req, res) => {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(req.body.password, salt);

          //Create new user
          const newUser = await new ModelUser({
            username: req.body.username,
            email: req.body.email,
            password: hashed,
          });

          //Save user to DB
          const user = await newUser.save();
          res.status(200).json(user);
        } catch (err) {
          res.status(500).json(err);
        }
      };

//----------------GENERRATE ACCESS TOKEN
      const generateAccessToken = (user) => {
        return jwt.sign(
          {
            id: user.id,
            admin: user.admin,
          },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: "30s" }
        );
      };
//----------------GENERRATE REFRESH TOKEN

      const generateRefreshToken = (user) => {
        return jwt.sign(
          {
            id: user.id,
            admin: user.admin,
          },
          process.env.JWT_REFRESH_KEY,
          { expiresIn: "60d" }
        );
      };

//////////////////////Login/////////////////////
      const loginUser = async (req, res)=>{
        try {generateAccessToken
            const user = await ModelUser.findOne({
                username: req.body.username
            })
            if (!user) {
              return res.status(404).json("User khong ton tai");
            }
            const validPassword = await bcrypt.compare(
              req.body.password,
              user.password
            );
            if(!validPassword){
                return res.status(404).json("Password khong chinh xac")
            }
            if(user && validPassword ){
              const accessToken =  generateAccessToken(user)

              const refreshToken = generateRefreshToken(user);

              refreshTokens.push(refreshToken);

              res.cookie("refreshToken", refreshToken,{
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
              });

              res.status(200).json({user, accessToken})
            }
        } catch (err) {
            res.status(500).json(err)
        }
      }


const requestRefreshToken = async(req, res)=>{
  //lay refreshToken tu user
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.status(401).json("You're not authenticated") 
  if(!refreshTokens.includes(refreshToken)){
    return res.status(403).json("Refresh token is not valid")
  }
  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user)=>{
    if(err){
      console.log(err)
    }

    refreshTokens = refreshTokens.filter((token)=> token !== refreshToken);
    //Create new accesstoken, refreshtoken
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);

    res.cookie("refreshToken", newRefreshToken,{
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    });
    res.status(200).json({ accessToken: newAccessToken });
  })
}
 

///////////////////////Logout///////////////////
      const userLogout = async (req, res)=>{
        //Clear cookie
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken)
        res.status(200).json("logout succesfully")
      }


module.exports = {
  registerUser,
  loginUser,
  requestRefreshToken,
  userLogout,
};
    
