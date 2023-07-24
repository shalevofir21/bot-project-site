const express = require('express');
const router = express.Router();
const authClient = require("../utils/authClient.js");
const client = require("../../index.js");
const { checkAuth } = require("../utils/checkAuth");

router.get("/auth", async(req, res) => {
  try {
    if(req.query.error) return res.writeHeader(200, {"Content-Type": "text/html", }),res.write("<html><body><style>body{background-color: #36393F;}</style><script>if(window.opener){window.close()}else{location.href = '/';}</script></body>"),res.end();
    const code = req.query.code;
    if(!code) return res.writeHeader(200, {"Content-Type": "text/html", }),res.write("<html><body><style>body{background-color: #36393F;}</style><script>if(window.opener){window.close()}else{location.href = '/';}</script></body>"),res.end();
    const loginkey = await authClient.getAccess(code);
    res.cookie("LoginKey", loginkey, { maxAge: 1000 * 60 * 60 * 24 * 30});
    let url = req.cookies.previousPage;
    if(url){
      res.writeHeader(200, {"Content-Type": "text/html", });
      res.write(`<html><body><style>body{background-color: #36393F;}</style><script>if(window.opener){var event = new CustomEvent('authed', {detail: {data: 'auth_complete', url: '${url}'}});window.opener.dispatchEvent(event);setTimeout(() => {window.close()}, 1000)}else{location.href = '${url}';}</script></body>`);
      res.end();
    }else{
      res.writeHeader(200, {"Content-Type": "text/html", });
      res.write("<html><body><style>body{background-color: #36393F;}</style><script>if(window.opener){var event = new CustomEvent('authed', {detail: {data: 'auth_complete', url: '/servers'}});window.opener.dispatchEvent(event);setTimeout(() => {window.close()}, 1000)}else{location.href = '/servers'}</script></body>");
      res.end();
    }
  } catch(error) {
    res.writeHeader(200, {"Content-Type": "text/html", })
    res.write("<html><body><style>body{background-color: #36393F;}</style><script>if(window.opener){window.close()}else{location.href = '/';}</script></body>")
    res.end();
  }
});

router.get("/guild-auth", checkAuth, async(req, res) => {
  try{
    if(req.query.error) return res.writeHeader(200, {"Content-Type": "text/html", }),res.write("<html><body><style>body{background-color: #36393F;}</style><script>if(window.opener){window.close()}else{location.href = '/';}</script></body>"),res.end();
    const guild = req.query.guild_id;
    if(guild && res.locals.user){
      res.writeHeader(200, {"Content-Type": "text/html", });
      res.write(`<html><body><style>body{background-color: #36393F;}</style><script>if(window.opener){var event = new CustomEvent('invited', {detail: {data: 'invite_complete', guild: '${guild}'}});window.opener.dispatchEvent(event);setTimeout(() => {window.close()}, 1000)}else{location.href = '/servers?guild_id=${guild}';}</script></body>`);
      res.end();
    }else{
      res.writeHeader(200, {"Content-Type": "text/html", });
      res.write(`<html><body><style>body{background-color: #36393F;}</style><script>if(window.opener){window.close()}else{location.href = '/';}</script></body>`);
      res.end();
    }
  }catch{
    res.writeHeader(200, {"Content-Type": "text/html", })
    res.write("<html><body><style>body{background-color: #36393F;}</style><script>if(window.opener){window.close()}else{location.href = '/';}</script></body>")
    res.end();
  }
});

router.get("/login", checkAuth, async(req, res) => {
  // res.redirect(authClient.authCodeLink)
  if(res.locals.user) return res.redirect("/servers");
  let guild = client.guilds.cache.get(req.query.guild)
  res.render("login", {
    title: guild ? guild.name : null,
    guild,
    icon: guild ? guild.iconURL() : null,
  })
});

router.get("/logout", async(req, res) => {
  res.clearCookie('LoginKey');
  res.redirect("/");
});


module.exports = router;