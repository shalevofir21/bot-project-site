const db = require("quick.db")

async function enable(req, res){
  if(req.body.channel){
    if(!req.client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.channel)){
      res.send({success: false, message: "Error: Unknown channel (refresh the page and try again)"});
    }else if(req.client.channels.cache.get(req.body.channel).type !== "text"){
      res.send({success: false, message: "Error: Unknown channel type (refresh the page and try again)"});
    }else if(!req.client.channels.cache.get(req.body.channel).permissionsFor(req.client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
      res.send({success: false, message: "Error: Bot does not have permissions in this channel (Try to give the bot administrator pemissions)"});
    }else{
      db.set(`Logging_${req.params.guildID}`, req.body.channel);
      res.send({success: true});
    }
  }else{
    db.delete(`Logging_${req.params.guildID}`);
    res.send({success: true});
  }
}




module.exports.enable = enable