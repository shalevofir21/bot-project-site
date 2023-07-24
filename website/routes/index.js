const express = require("express");
const router = express.Router();
const db = require("quick.db");
const fs = require("fs");
const config = require("../../config.json");
const { checkAuth } = require("../utils/checkAuth");
const { get } = require("../utils/getGuilds");
const guildsConfig = require("../../bot/data/schemas/guilds-config");
const itemsInventory = require("../../bot/data/schemas/itemsInventory");
const savedCoins = require("../../bot/data/schemas/savedCoins");
const client = require("../../index.js");

router.get("/arc-sw.js", async (req, res) => {
  res.type('.js');
  res.send(`!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=100)}({100:function(t,e,r){"use strict";r.r(e);var n=r(3);if("undefined"!=typeof ServiceWorkerGlobalScope){var o="https://arc.io"+n.j;importScripts(o)}else if("undefined"!=typeof SharedWorkerGlobalScope){var c="https://arc.io"+n.h;importScripts(c)}else if("undefined"!=typeof DedicatedWorkerGlobalScope){var i="https://arc.io"+n.b;importScripts(i)}},3:function(t,e,r){"use strict";r.d(e,"a",(function(){return n})),r.d(e,"e",(function(){return c})),r.d(e,"i",(function(){return i})),r.d(e,"h",(function(){return a})),r.d(e,"b",(function(){return d})),r.d(e,"j",(function(){return f})),r.d(e,"c",(function(){return u})),r.d(e,"d",(function(){return s})),r.d(e,"g",(function(){return l})),r.d(e,"f",(function(){return m}));var n={images:["bmp","jpeg","jpg","ttf","pict","svg","webp","eps","svgz","gif","png","ico","tif","tiff","bpg","avif","jxl"],video:["mp4","3gp","webm","mkv","flv","f4v","f4p","f4bogv","drc","avi","mov","qt","wmv","amv","mpg","mp2","mpeg","mpe","m2v","m4v","3g2","gifv","mpv","av1"],audio:["mid","midi","aac","aiff","flac","m4a","m4p","mp3","ogg","oga","mogg","opus","ra","rm","wav","webm","f4a","pat"],interchange:["json","yaml","xml","csv","toml","ini","bson","asn1","ubj"],archives:["jar","iso","tar","tgz","tbz2","tlz","gz","bz2","xz","lz","z","7z","apk","dmg","rar","lzma","txz","zip","zipx"],documents:["pdf","ps","doc","docx","ppt","pptx","xls","otf","xlsx"],other:["srt","swf"]},o="arc:",c={COMLINK_INIT:"".concat(o,"comlink:init"),NODE_ID:"".concat(o,":nodeId"),CDN_CONFIG:"".concat(o,"cdn:config"),P2P_CLIENT_READY:"".concat(o,"cdn:ready"),STORED_FIDS:"".concat(o,"cdn:storedFids"),SW_HEALTH_CHECK:"".concat(o,"cdn:healthCheck"),WIDGET_CONFIG:"".concat(o,"widget:config"),WIDGET_INIT:"".concat(o,"widget:init"),WIDGET_UI_LOAD:"".concat(o,"widget:load"),BROKER_LOAD:"".concat(o,"broker:load"),RENDER_FILE:"".concat(o,"inlay:renderFile"),FILE_RENDERED:"".concat(o,"inlay:fileRendered")},i="serviceWorker",a="/".concat("shared-worker",".js"),d="/".concat("dedicated-worker",".js"),f="/".concat("arc-sw-core",".js"),p="".concat("arc-sw",".js"),u=("/".concat(p),"/".concat("arc-sw"),"arc-db"),s="key-val-store",l="".concat("https://overmind.arc.io","/api/propertySession"),m="".concat("https://warden.arc.io","/mailbox/propertySession")}});`)
});

router.get("/", checkAuth, async(req, res) => {
  let news = [];
  if(db.get("announcement")) db.get("announcement").slice().reverse().forEach(a => {
    news.push(a.text)
  })

  let text = '';
  for(let i = 0; i < news.length; i++){
    text+=news[i];
    if(i!=news.length-1){
      text+=' | ';
    }
  }

  res.render("index", {
    bot: client,
    admin: res.locals.user ? config.admins.includes(res.locals.user.id) : false,
    announcement: news.length === 0 ? "The news board is empty right now" : text
  });
});

router.get("/stats", checkAuth, async(req, res) => {
  res.render("stats", {
    bot: client,
    admin: res.locals.user ? config.admins.includes(res.locals.user.id) : false,
    uptime: `${Math.floor(client.uptime / 86400000)} days, ${Math.floor(client.uptime / 3600000) % 24} hours, ${Math.floor(client.uptime / 60000) % 60} minutes, ${Math.floor(client.uptime / 1000) % 60} seconds`
  });
});

router.get("/invite", checkAuth, get, async(req, res) => {
  // res.redirect(`https://discord.com/oauth2/authorize?client_id=${config.id}&permissions=8&scope=bot`);
  if(!res.locals.user) return res.redirect(`/login?guild=${req.query.guild}`);
  let guild = res.guilds.get(req.query.guild)
  
  res.render("invite", {
    title: guild ? guild.name : null,
    guild,
    icon: guild?.iconHash ? guild.iconUrl() : null,
    admin: res.locals.user ? config.admins.includes(res.locals.user.id) : false,
  })
});

router.get("/servers", checkAuth, get, async(req, res) => {
  if(req.query.guild_id) return res.redirect("/server/"+req.query.guild_id);
  if(res.locals.user === null) return res.redirect("/login");
  let guilds = res.guilds
  res.render("servers-list", {
    bot: client,
    admin: res.locals.user ? config.admins.includes(res.locals.user.id) : false,
    guilds: guilds
  });
});

router.get("/admin", checkAuth, async(req, res) => {
  if(res.locals.user === null) return res.redirect("/login");
  if(!config.admins.includes(res.locals.user.id)) return res.render("errors/404");
  
  res.render("admin", {
    admin: res.locals.user ? config.admins.includes(res.locals.user.id) : false,
    guilds: client.guilds,
    announcement: db.get("announcement")
  });
})

router.post("/admin", checkAuth, async(req, res) => {
  if(res.locals.user === null) return res.redirect("/login");
  if(!config.admins.includes(res.locals.user.id)) return res.render("errors/404");
  if(client.guilds.cache.get(req.body.id)){
    res.send({success: true})
  }else{
    res.send({success: false, error: "Error: This guild is not exist"})
  }
})

router.post("/admin/delete/:id", checkAuth, async(req, res) => {
  if(res.locals.user === null) return res.redirect("/login");
  if(!config.admins.includes(res.locals.user.id)) return res.render("errors/404");
  
  let data = db.get("announcement")

  db.delete("announcement"
  )
  data.forEach(d => {
    if(d.id === req.params.id) return
    db.push("announcement", d)
  })
  res.redirect("/admin")
})

router.get("/admin/create", checkAuth, async(req, res) => {
  if(res.locals.user === null) return res.redirect("/login");
  if(!config.admins.includes(res.locals.user.id)) return res.render("errors/404");

  res.render("create", {
    admin: res.locals.user ? config.admins.includes(res.locals.user.id) : false
  });
})

router.post("/admin/create", checkAuth, async(req, res) => {
  if(res.locals.user === null) return res.redirect("/login");
  if(!config.admins.includes(res.locals.user.id)) return res.render("errors/404");

  let data = {
    text: req.body.text,
    id: randomId()
  }
  db.push("announcement", data)
  res.redirect("/admin")
})

function randomId() {
  var result = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 8; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
}

//logs
function getChannels(req, guildId, dbName){
  let html = ""
  client.guilds.cache.get(guildId).channels.cache.filter(c => c.type === 'GUILD_TEXT').filter(c => c.permissionsFor(client.user).has("SEND_MESSAGES") && c.permissionsFor(client.user).has("VIEW_CHANNEL")).forEach(c => {
    if(db.get(`${dbName}_${guildId}.channel`) === c.id){
      html += `<option value="${c.id}" selected>#${c.name}</option>`
    }else{
      html += `<option value="${c.id}">#${c.name}</option>`
    }
  })
  return html
}

function getEnabled(guildId, dbName, id){
  let html = ""
  if(!db.get(`${dbName}_${guildId}.enabled`) || db.get(`${dbName}_${guildId}.enabled`) === "true"){
    html += `<input id="${id}-enabled" type="checkbox" checked>`
  }else{
    html += `<input id="${id}-enabled" type="checkbox">`
  }
  return html
}

function getColor(type){
  if(type === "deleted") return "FF0000";
  else if(type === "created") return "32FF00";
  else if(type === "updated") return "0900FF";
}

router.post("/get/server/:guildID/logs", checkAuth, get, async (req, res) => {
  if(res.locals.user === null) return res.redirect("../login");
  let server = client.guilds.cache.get(req.params.guildID);
  let admins = JSON.parse(fs.readFileSync("./config.json").toString()).admins;
  let guilds = res.guilds 

  try{
    if(!server && guilds.get(req.params.guildID)){
      return res.redirect(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&redirect_uri=${config.url}/servers&response_type=code&scope=bot&permissions=8&guild_id=${req.params.guildID}`);
    }else if(!server && !guilds.get(req.params.guildID)){
      return res.redirect("../servers")
    }else if(!admins.includes(res.locals.user.id) && !guilds.get(req.params.guildID)?.permissions.includes('MANAGE_GUILD')){
      return res.redirect(`../servers`);
    };
  }catch{
    res.redirect("../servers");
  }
  let response = ""
  req.body.data.forEach(data => {
    response += `<span id="error-${data.db}" name="error" class="text-danger" style="display: none; font-size: 25px;"></span>
    <div class="list my-1" style="width: auto; height: auto; margin: auto;">
      <span class="text-light float-left my-3" style="padding-left: 20px; font-size: larger;">${data.name}:</span>
      <select id="${data.id}-channel" class="select form-control form-control-sm" multiple>
        ${getChannels(req, req.params.guildID, data.db)}
      </select>
      <input type="color" id="${data.id}-color" style="height: 25px;" class="text-light my-3" name="head" value="${db.get(`${data.db}_${req.params.guildID}.color`) || `#${getColor(data.type)}`}">
      <label for="head" style="font-size: larger;"class="text-light my-3">Embed color</label>
      <div class='switch float-right my-3' style="margin-right: 20px;">
        <label>
          ${getEnabled(req.params.guildID, data.db, data.id)}
          <span class="slider round"></span>
        </label>
      </div>
      <br>
    </div>
    <br>`
  })
  await res.send(response)
});

router.get("/shop/:guildID", checkAuth, get, async (req, res) => {
  res.cookie("previousPage",  req.originalUrl);
  if(res.locals.user === null) return res.redirect(`/login?guild=${req.params.guildID}`);
  let server = client.guilds.cache.get(req.params.guildID);
  let guilds = res.guilds
  let admins = JSON.parse(fs.readFileSync("./config.json").toString()).admins;

  if(server && guilds.get(req.params.guildID)){
    res.render(`shop`, {
      bot: client,
      guildData: await guildsConfig.get(req.params.guildID),
      inventory: await itemsInventory.get(req.params.guildID, res.locals.user.id),
      coins: await savedCoins.get(req.params.guildID, res.locals.user.id),
      guild: server,
      icon: res.guilds.get(req.params.guildID)?.iconHash ? server.iconURL() : null,
      admin: res.locals.user ? admins.includes(res.locals.user.id) : false
    })
  }else{
    res.clearCookie('previousPage');
    res.redirect("../");
  }
});

router.post("/shop/:guildID", checkAuth, get, async (req, res) => {
  if(res.locals.user === null) return res.send({success: false, loggedIn: false});
  let server = client.guilds.cache.get(req.params.guildID);
  let guilds = res.guilds;

  if(server && guilds.get(req.params.guildID)){
    if(req.body.action === "buy"){
      const guildDB = await guildsConfig.get(req.params.guildID);
      if(!guildDB.coinModule) return res.send({success: false, error: "Coins system is disabled"});
      const inventory = await itemsInventory.get(req.params.guildID, res.locals.user.id);
      const userCoins = await savedCoins.get(req.params.guildID, res.locals.user.id);
      
      if(!guildDB.coinsShop.some(item => item.id === req.body.item)) return res.send({success: false, error: "Item is not exist", coins: userCoins.coins});
      let index = guildDB.coinsShop.findIndex(item => item.id === req.body.item);

      if(inventory.items.some(item => item.item === req.body.item)) return res.send({success: true});
      if(userCoins.coins < guildDB.coinsShop[index].price) return res.send({success: false, error: "Not enough coins", coins: userCoins.coins});
      
      userCoins.coins = userCoins.coins - Number(guildDB.coinsShop[index].price);
      inventory.items.push({item: req.body.item});

      inventory.save();
      userCoins.save();
      res.send({success: true, coins: userCoins.coins});
    }else if(req.body.action === "use"){
      const guildDB = await guildsConfig.get(req.params.guildID);
      if(!guildDB.coinModule) return res.send({success: false, error: "Coins system is disabled"});
      const inventory = await itemsInventory.get(req.params.guildID, res.locals.user.id);
      
      if(!guildDB.coinsShop.some(item => item.id === req.body.item)) return res.send({success: false, error: "Item is not exist"});

      if(!inventory.items.some(item => item.item === req.body.item)) return res.send({success: false, error: "You do not have this item"});

      let index = guildDB.coinsShop.findIndex(item => item.id === req.body.item);
      let role = client.guilds.cache.get(req.params.guildID).roles.cache.get(guildDB.coinsShop[index].RoleID);
      
      if(!client.guilds.cache.get(req.params.guildID).me.permissions.has("MANAGE_ROLES")) return res.send({success: false, error: "The bot does not have permissions"});
      if(client.guilds.cache.get(req.params.guildID).me.roles.highest.position < role.position) return res.send({success: false, error: "The role is highest then the bot roles"});
      if(!role) return res.send({success: false, error: "Failed to add the role"});
      
      try{
        let member = await client.guilds.cache.get(req.params.guildID).members.fetch(res.locals.user.id);
        
        member.roles.add(role);
        res.send({success: true});
      }catch(e){
        res.send({success: false, error: "Failed to add you the role"});
      }
    }
  }else{
    return res.send({success: false, error: "You or the bot is not on this server"});
  }
});

module.exports = router;

