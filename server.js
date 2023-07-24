const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require('cookie-parser');
const config = require("./config.json");
const authClient = require("./website/utils/authClient");
const fs = require("fs");
const JavaScriptObfuscator = require('javascript-obfuscator');

module.exports.load = async (client) => {
  
  const files = fs.readdirSync(`./website/unencryptedJsFiles/`).filter(d => d.endsWith('.js'));

  for (let file of files) {
    fs.readFile(`./website/unencryptedJsFiles/${file}`, "UTF-8", function(err, data) {
      if (err) {
        throw err;
      }
      
      let obfuscationResult = JavaScriptObfuscator.obfuscate(data);
      
      fs.writeFile(`./website/assets/js/${file}`, obfuscationResult.getObfuscatedCode() , function(err) {
        if(err) {
          return console.log(err);
        }
      });
    });
  };

  app.use(cookieParser());
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.set('view engine', 'ejs');
  app.set('views', "./website/views");
  app.use(express.static("./website/assets"));

  app.use(session({
    secret: "FD5DS68RD589DW4",
    resave: false,
    saveUninitialized: false,
  }));

  app.use(async (req, res, next) => {
    res.locals.user = null;
    res.locals.loginUrl = authClient.authCodeLink;
    res.locals.inviteUrl = `https://discord.com/oauth2/authorize?client_id=${config.id}&permissions=1376251103&scope=bot&response_type=code&redirect_uri=${config.url}/guild-auth`
    next();
  });

  app.use("/", 
    require("./website/routes/index"),
    require("./website/routes/auth")
  );
  app.use("/server", require("./website/routes/dashboard"));

  app.listen(config.port, (err) => {
    if(err) throw err;
    console.log(`dashboard online on port ${config.port}`);
  });
  app.all('*', (req, res) => res.render('errors/404'));
};
