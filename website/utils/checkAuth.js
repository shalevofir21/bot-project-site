const authClient = require("./authClient.js");

module.exports.checkAuth = async (req, res, next) => {
  try{
    if(req.cookies.LoginKey){
      let user = await authClient.getUser(req.cookies.LoginKey);
      if(user){
        res.locals.user = user;
        return next();
      }else{
        res.locals.user = null;
        return next();
      };
    }else{
      res.locals.user = null;
      return next();
    };
  }catch{
    res.locals.user = null;
    return next();
  };
};