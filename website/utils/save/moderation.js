const db = require("quick.db")

function prefix(req, res){
  if(req.body.prefix){
    db.set(`prefix_${req.params.guildID}`, req.body.prefix);
    return {success: true};
  }else{
    db.set(`prefix_${req.params.guildID}`, "!");
    return {success: true};
  };
}

function muteRole(req, res){
  if(req.body.muteRole){
    let muteRole = req.client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.muteRole);
    if(!muteRole || !muteRole.editable || muteRole.id === req.client.guilds.cache.get(req.params.guildID).roles.everyone.id){
      return {success: false, message: "Error: Unknown role (refresh the page and try again)"};
    }else if(muteRole.position > req.client.guilds.cache.get(req.params.guildID).me.roles.highest.position){
      return {success: false, message: "Error: The bot must to be above the role"};
    }else{
      db.set(`muterole_${req.params.guildID}`, req.body.muteRole);
      return {success: true};
    };
  }else{
    db.delete(`muterole_${req.params.guildID}`);
    return {success: true};
  };
}

function verificationChannel(req, res){
  if(req.body.verificationChannel){
    if(!req.client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.verificationChannel)){
      return {success: false, message: "Error: Unknown channel (refresh the page and try again)"};
    }else if(req.client.channels.cache.get(req.body.verificationChannel).type !== "text"){
      return {success: false, message: "Error: Unknown channel type (refresh the page and try again)"};
    }else if(!req.client.channels.cache.get(req.body.verificationChannel).permissionsFor(req.client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
      return {success: false, message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"};
    }else if(!req.client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.verificationRole) || req.client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.verificationRole).position > req.client.guilds.cache.get(req.params.guildID).me.roles.highest.position){
      return {success: false, message: "Error: You must do set verification role before"};
    }else{
      if(req.body.verificationChannel !== db.fetch(`verificationchannel_${req.params.guildID}`)){
        req.client.channels.cache.get(req.body.verificationChannel).send(`**Welcome To ${req.client.guilds.cache.get(req.params.guildID).name}!\nTo Get Verified Type - \`${db.fetch(`prefix_${req.params.guildID}`)}verify\`**`);
      }
      db.set(`verificationchannel_${req.params.guildID}`, req.body.verificationChannel);
      return {success: true};
    };
  }else{
    db.delete(`verificationchannel_${req.params.guildID}`);
    return {success: true};
  };
}

function verificationRole(req, res){
  if(req.body.verificationRole){ //verification role
    if(!req.client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.verificationRole) || !req.client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.verificationRole).editable || req.body.verificationRole === req.client.guilds.cache.get(req.params.guildID).roles.everyone.id){
     return {success: false, message: "Error: Unknown role (refresh the page and try again)"};
    }else if(req.client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.verificationRole).position > req.client.guilds.cache.get(req.params.guildID).me.roles.highest.position){
     return {success: false, message: "Error: The bot must to be above the role"};
    }else{
      db.set(`verificationrole_${req.params.guildID}`, req.body.verificationRole);
     return {success: true};
    };
  }else{
    db.delete(`verificationrole_${req.params.guildID}`);
   return {success: true};
  };
}

function welcomeChannel(req, res){
  if(req.body.welcomeChannel){ //welcome channel
    if(!req.client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.welcomeChannel)){
      return {success: false, message: "Error: Unknown channel (refresh the page and try again)"};
    }else if(req.client.channels.cache.get(req.body.welcomeChannel).type !== "text"){
      return {success: false, message: "Error: Unknown channel type (refresh the page and try again)"};
    }else if(!req.client.channels.cache.get(req.body.welcomeChannel).permissionsFor(req.client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
      return {success: false, message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"};
    }else{
      db.set(`welcome_${req.params.guildID}`, req.body.welcomeChannel);
      return {success: true};
    };
  }else{
    db.delete(`welcome_${req.params.guildID}`);
    return {success: true};
  };
}

function modLogChannel(req, res){
  if(req.body.modlogchannel){ //mod log channel
    if(!req.client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.modlogchannel)){
      return {success: false, message: "Error: Unknown channel (refresh the page and try again)"};
    }else if(req.client.channels.cache.get(req.body.modlogchannel).type !== "text"){
      return {success: false, message: "Error: Unknown channel type (refresh the page and try again)"};
    }else if(!req.client.channels.cache.get(req.body.modlogchannel).permissionsFor(req.client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
      return {success: false, message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"};
    }else{
      db.set(`modlog_${req.params.guildID}`, req.body.modlogchannel);
      return {success: true};
    };
  }else{
    db.delete(`modlog_${req.params.guildID}`);
    return {success: true};
  };
}

function antiBadWords(req, res){
  if(req.body.anitbadwords){ //anti bad words
    db.delete(`anitbadwords_${req.params.guildID}`);
    req.body.anitbadwords.forEach(w => {
      let data = {
        swearword: w,
        author: `${res.locals.user.username}#${res.locals.user.discriminator}`,
      };
      db.push(`anitbadwords_${req.params.guildID}`, data);
    });
    return {success: true};
  }else{
    db.delete(`anitbadwords_${req.params.guildID}`);
    return {success: true};
  };
}

module.exports.prefix = prefix
module.exports.muteRole = muteRole
module.exports.verificationChannel = verificationChannel
module.exports.verificationRole = verificationRole
module.exports.welcomeChannel = welcomeChannel
module.exports.modLogChannel = modLogChannel
module.exports.antiBadWords = antiBadWords