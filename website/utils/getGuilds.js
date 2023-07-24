const authClient = require("./authClient.js");
const guilds = new Map();

module.exports.get = async function get(req, res, next) {
  if(res.locals.user === null) return next();
  const guild = guilds.get(req.cookies.LoginKey);
  if(!guild){
    setTimeout(() => {
      guilds.delete(req.cookies.LoginKey)
    }, 10000);
    let data = await authClient.getGuilds(req.cookies.LoginKey)
    guilds.set(req.cookies.LoginKey, data);
    
    res.guilds = guilds.get(req.cookies.LoginKey);
    return next()
  }else{
    res.guilds = guilds.get(req.cookies.LoginKey);
    return next()
  }
}