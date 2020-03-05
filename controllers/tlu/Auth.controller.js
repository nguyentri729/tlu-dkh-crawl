const jwt = require("jsonwebtoken");
const UserModel = require('../../models/User.modal')


const Auth = async (req, res, next) => {
   
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        
        let token = req.headers.authorization.split(" ")[1];
        let {_id } = jwt.verify(token, process.env.JWT_SECURE);
        req.data = await UserModel.findUser(_id)
        req.access_token = token
        next();
      } else {
        return res.status(302).json({
          error: "access_token required !!!",
          msg: 'tri 20cm 30phut :)))'
        });
      }
    } catch (error) {
      res.status(302).json({
        error: error.message
      });
    }
  };
module.exports = Auth 
