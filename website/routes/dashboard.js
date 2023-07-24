const fs = require("fs");
const ms = require("ms")
const db = require("quick.db");
const discord = require("discord.js");
const express = require('express');
const router = express.Router();
const { checkAuth } = require("../utils/checkAuth");
const config = require("../../config.json");
const client = require("../../index.js");
let Data = require("../../bot/data/schemas/RoleData.js");
const RankSettings = require("../../bot/data/schemas/RankSettings.js");
const RoleReward = require("../../bot/data/schemas/RankRoleReward.js");
const guildsConfig = require("../../bot/data/schemas/guilds-config");
const premiumPages = ["custom"];
const { get } = require("../utils/getGuilds");

router.post("/:guildID/enablepremium", checkAuth, get, async (req, res) => {
  let admins = JSON.parse(fs.readFileSync("./config.json").toString()).admins;
  if(!admins.includes(res.locals.user.id) && !res.guilds.get(req.params.guildID)?.permissions.includes('MANAGE_GUILD')) return res.redirect("../servers");
  let data = {
    by: res.locals.user.username
  }
  db.set(`premium_${req.params.guildID}`, data)
  res.redirect('back');
})

router.post("/:guildID/disablepremium", checkAuth, get, async (req, res) => {
  let admins = JSON.parse(fs.readFileSync("./config.json").toString()).admins;
  if(!admins.includes(res.locals.user.id) && !res.guilds.get(req.params.guildID)?.permissions.includes('MANAGE_GUILD')) return res.redirect("../servers");

  db.delete(`premium_${req.params.guildID}`)
  res.redirect('back');
})

router.get("/:guildID/:category", checkAuth, get, async (req, res) => {
  res.cookie("previousPage",  req.originalUrl);
  if(res.locals.user === null) return res.redirect(`/login?guild=${req.params.guildID}`);
  let guild = client.guilds.cache.get(req.params.guildID);
  let guilds = res.guilds
  let admins = JSON.parse(fs.readFileSync("./config.json").toString()).admins;

  try{
    if(!guild && guilds.get(req.params.guildID)){
      res.clearCookie('previousPage');
      return res.redirect(`/invite?guild=${req.params.guildID}`);
    }else if(!guild && !guilds.get(req.params.guildID)){
      res.clearCookie('previousPage');
      return res.redirect("../servers")
    }else if(!admins.includes(res.locals.user.id) && !guilds.get(req.params.guildID)?.permissions.includes('MANAGE_GUILD')){
      res.clearCookie('previousPage');
      return res.redirect(`../servers`);
    };
  }catch{
    res.clearCookie('previousPage');
    res.redirect("../servers");
  }
  try{
    if(fs.existsSync(`website/views/categories/${req.params.category.toLowerCase()}.ejs`)){
      if(premiumPages.includes(req.params.category.toLowerCase()) && !db.get(`premium_${req.params.guildID}`)) return res.render("errors/404");
      let settings = await RankSettings.findOneAndUpdate({guildId: req.params.guildID}, {guildId: req.params.guildID}, {upsert: true, new:true});
      let { ModuleIs, DoubleXp } = settings;
      
      res.render(`categories/${req.params.category.toLowerCase()}`, {
        bot: client,
        admin: res.locals.user ? admins.includes(res.locals.user.id) : false,
        db: db,
        data: await Data.findOne({ guildId: req.params.guildID }),
        xp: { ModuleIs, DoubleXp },
        coins: await guildsConfig.get(req.params.guildID),
        rlevel: await RoleReward.findOne({guildId: req.params.guildID}),
        roles: JSON.stringify(guild.roles.cache.filter(role => role.position < guild.me.roles.highest.position).filter(role => role.id !== guild.roles.everyone.id).filter(role => role.editable).map(role => ( {id: role.id, text: "@"+role.name} ))),
        guild,
        icon: null
      });
    }else{
      res.render("errors/404");
    }
  }catch{
    res.render("errors/404");
  };
});

router.post("/:guildID/:category", checkAuth, get, async (req, res) => {
  if(!client.guilds.cache.get(req.params.guildID)) return res.send({failed: true, error: "The bot is not in this guild"});
  let admins = JSON.parse(fs.readFileSync("./config.json").toString()).admins;
  if(!admins.includes(res.locals.user?.id) && !res.guilds?.get(req.params.guildID)?.permissions.includes('MANAGE_GUILD')) return res.send({failed: true});

  if(req.params.category.toLowerCase() === "logs"){
    if(req.body.sData.category === "messages"){// messages logs
      let errors = []
      //message deleted
      if(req.body.sData.deleted.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.deleted.channel)){
        errors.push({success: false, id: "messageDeleted", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.deleted.channel && client.channels.cache.get(req.body.sData.deleted.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "messageDeleted", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.deleted.channel && !client.channels.cache.get(req.body.sData.deleted.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "messageDeleted", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.deleted.enabled === "true" && !req.body.sData.deleted.channel){
        errors.push({success: false, id: "messageDeleted", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`messageDeleted_${req.params.guildID}.channel`, req.body.sData.deleted.channel);
        db.set(`messageDeleted_${req.params.guildID}.enabled`, req.body.sData.deleted.enabled);
        db.set(`messageDeleted_${req.params.guildID}.color`, req.body.sData.deleted.color);
        errors.push({success: true, id: "messageDeleted"});
      }
      //message updated
      if(req.body.sData.edited.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.edited.channel)){
        errors.push({success: false, id: "messageEdited", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.edited.channel && client.channels.cache.get(req.body.sData.edited.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "messageEdited", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.edited.channel && !client.channels.cache.get(req.body.sData.edited.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "messageEdited", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.edited.enabled === "true" && !req.body.sData.edited.channel){
        errors.push({success: false, id: "messageEdited", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`messageEdited_${req.params.guildID}.channel`, req.body.sData.edited.channel);
        db.set(`messageEdited_${req.params.guildID}.enabled`, req.body.sData.edited.enabled);
        db.set(`messageEdited_${req.params.guildID}.color`, req.body.sData.edited.color);
        errors.push({success: true, id: "messageEdited"});
      }
      await res.send(errors)
    }else if(req.body.sData.category === "members"){// members logs
      let errors = []
      //member joined
      if(req.body.sData.joined.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.joined.channel)){
        errors.push({success: false, id: "memberJoined", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.joined.channel && client.channels.cache.get(req.body.sData.joined.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "memberJoined", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.joined.channel && !client.channels.cache.get(req.body.sData.joined.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "memberJoined", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.joined.enabled === "true" && !req.body.sData.joined.channel){
        errors.push({success: false, id: "memberJoined", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`memberJoined_${req.params.guildID}.channel`, req.body.sData.joined.channel);
        db.set(`memberJoined_${req.params.guildID}.enabled`, req.body.sData.joined.enabled);
        db.set(`memberJoined_${req.params.guildID}.color`, req.body.sData.joined.color);
        errors.push({success: true, id: "memberJoined"});
      }
      //member left
      if(req.body.sData.left.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.left.channel)){
        errors.push({success: false, id: "memberLeft", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.left.channel && client.channels.cache.get(req.body.sData.left.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "memberLeft", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.left.channel && !client.channels.cache.get(req.body.sData.left.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "memberLeft", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.left.enabled === "true" && !req.body.sData.left.channel){
        errors.push({success: false, id: "memberLeft", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`memberLeft_${req.params.guildID}.channel`, req.body.sData.left.channel);
        db.set(`memberLeft_${req.params.guildID}.enabled`, req.body.sData.left.enabled);
        db.set(`memberLeft_${req.params.guildID}.color`, req.body.sData.left.color);
        errors.push({success: true, id: "memberLeft"});
      }
      //member roles updated
      if(req.body.sData.updated.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.updated.channel)){
        errors.push({success: false, id: "memberRolesUpdated", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.updated.channel && client.channels.cache.get(req.body.sData.updated.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "memberRolesUpdated", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.updated.channel && !client.channels.cache.get(req.body.sData.updated.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "memberRolesUpdated", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.updated.enabled === "true" && !req.body.sData.updated.channel){
        errors.push({success: false, id: "memberRolesUpdated", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`memberRolesUpdated_${req.params.guildID}.channel`, req.body.sData.updated.channel);
        db.set(`memberRolesUpdated_${req.params.guildID}.enabled`, req.body.sData.updated.enabled);
        db.set(`memberRolesUpdated_${req.params.guildID}.color`, req.body.sData.updated.color);
        errors.push({success: true, id: "memberRolesUpdated"});
      }
      await res.send(errors)
    }else if(req.body.sData.category === "voice"){// voice logs
      let errors = []
      //member joined
      if(req.body.sData.joined.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.joined.channel)){
        errors.push({success: false, id: "memberJoinedVoiceChannel", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.joined.channel && client.channels.cache.get(req.body.sData.joined.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "memberJoinedVoiceChannel", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.joined.channel && !client.channels.cache.get(req.body.sData.joined.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "memberJoinedVoiceChannel", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.joined.enabled === "true" && !req.body.sData.joined.channel){
        errors.push({success: false, id: "memberJoinedVoiceChannel", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`memberJoinedVoiceChannel_${req.params.guildID}.channel`, req.body.sData.joined.channel);
        db.set(`memberJoinedVoiceChannel_${req.params.guildID}.enabled`, req.body.sData.joined.enabled);
        db.set(`memberJoinedVoiceChannel_${req.params.guildID}.color`, req.body.sData.joined.color);
        errors.push({success: true, id: "memberJoinedVoiceChannel"});
      }
      //member left
      if(req.body.sData.left.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.left.channel)){
        errors.push({success: false, id: "memberLeftVoiceChannel", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.left.channel && client.channels.cache.get(req.body.sData.left.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "memberLeftVoiceChannel", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.left.channel && !client.channels.cache.get(req.body.sData.left.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "memberLeftVoiceChannel", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.left.enabled === "true" && !req.body.sData.left.channel){
        errors.push({success: false, id: "memberLeftVoiceChannel", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`memberLeftVoiceChannel_${req.params.guildID}.channel`, req.body.sData.left.channel);
        db.set(`memberLeftVoiceChannel_${req.params.guildID}.enabled`, req.body.sData.left.enabled);
        db.set(`memberLeftVoiceChannel_${req.params.guildID}.color`, req.body.sData.left.color);
        errors.push({success: true, id: "memberLeftVoiceChannel"});
      }
      //member muted
      if(req.body.sData.muted.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.muted.channel)){
        errors.push({success: false, id: "memberMuted", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.muted.channel && client.channels.cache.get(req.body.sData.muted.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "memberMuted", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.muted.channel && !client.channels.cache.get(req.body.sData.muted.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "memberMuted", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.muted.enabled === "true" && !req.body.sData.muted.channel){
        errors.push({success: false, id: "memberMuted", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`memberMuted_${req.params.guildID}.channel`, req.body.sData.muted.channel);
        db.set(`memberMuted_${req.params.guildID}.enabled`, req.body.sData.muted.enabled);
        db.set(`memberMuted_${req.params.guildID}.color`, req.body.sData.muted.color);
        errors.push({success: true, id: "memberMuted"});
      }
      //member unmuted
      if(req.body.sData.unmuted.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.unmuted.channel)){
        errors.push({success: false, id: "memberUnmuted", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.unmuted.channel && client.channels.cache.get(req.body.sData.unmuted.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "memberUnmuted", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.unmuted.channel && !client.channels.cache.get(req.body.sData.unmuted.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "memberUnmuted", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.unmuted.enabled === "true" && !req.body.sData.unmuted.channel){
        errors.push({success: false, id: "memberUnmuted", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`memberUnmuted_${req.params.guildID}.channel`, req.body.sData.unmuted.channel);
        db.set(`memberUnmuted_${req.params.guildID}.enabled`, req.body.sData.unmuted.enabled);
        db.set(`memberUnmuted_${req.params.guildID}.color`, req.body.sData.unmuted.color);
        errors.push({success: true, id: "memberUnmuted"});
      }
      //member switched voice channel
      if(req.body.sData.switched.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.switched.channel)){
        errors.push({success: false, id: "memberSwitchedVoiceChannel", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.switched.channel && client.channels.cache.get(req.body.sData.switched.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "memberSwitchedVoiceChannel", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.switched.channel && !client.channels.cache.get(req.body.sData.switched.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "memberSwitchedVoiceChannel", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.switched.enabled === "true" && !req.body.sData.switched.channel){
        errors.push({success: false, id: "memberSwitchedVoiceChannel", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`memberSwitchedVoiceChannel_${req.params.guildID}.channel`, req.body.sData.switched.channel);
        db.set(`memberSwitchedVoiceChannel_${req.params.guildID}.enabled`, req.body.sData.switched.enabled);
        db.set(`memberSwitchedVoiceChannel_${req.params.guildID}.color`, req.body.sData.switched.color);
        errors.push({success: true, id: "memberSwitchedVoiceChannel"});
      }
      await res.send(errors)
    }else if(req.body.sData.category === "server"){// server logs
      let errors = []
      //channel created
      if(req.body.sData.channelCreated.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.channelCreated.channel)){
        errors.push({success: false, id: "channelCreated", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.channelCreated.channel && client.channels.cache.get(req.body.sData.channelCreated.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "channelCreated", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.channelCreated.channel && !client.channels.cache.get(req.body.sData.channelCreated.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "channelCreated", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.channelCreated.enabled === "true" && !req.body.sData.channelCreated.channel){
        errors.push({success: false, id: "channelCreated", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`channelCreated_${req.params.guildID}.channel`, req.body.sData.channelCreated.channel);
        db.set(`channelCreated_${req.params.guildID}.enabled`, req.body.sData.channelCreated.enabled);
        db.set(`channelCreated_${req.params.guildID}.color`, req.body.sData.channelCreated.color);
        errors.push({success: true, id: "channelCreated"});
      }
      //channel deleted
      if(req.body.sData.channelDeleted.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.channelDeleted.channel)){
        errors.push({success: false, id: "channelDeleted", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.channelDeleted.channel && client.channels.cache.get(req.body.sData.channelDeleted.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "channelDeleted", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.channelDeleted.channel && !client.channels.cache.get(req.body.sData.channelDeleted.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "channelDeleted", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.channelDeleted.enabled === "true" && !req.body.sData.channelDeleted.channel){
        errors.push({success: false, id: "channelDeleted", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`channelDeleted_${req.params.guildID}.channel`, req.body.sData.channelDeleted.channel);
        db.set(`channelDeleted_${req.params.guildID}.enabled`, req.body.sData.channelDeleted.enabled);
        db.set(`channelDeleted_${req.params.guildID}.color`, req.body.sData.channelDeleted.color);
        errors.push({success: true, id: "channelDeleted"});
      }
      //role created
      if(req.body.sData.roleCreated.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.roleCreated.channel)){
        errors.push({success: false, id: "roleCreated", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.roleCreated.channel && client.channels.cache.get(req.body.sData.roleCreated.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "roleCreated", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.roleCreated.channel && !client.channels.cache.get(req.body.sData.roleCreated.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "roleCreated", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.roleCreated.enabled === "true" && !req.body.sData.roleCreated.channel){
        errors.push({success: false, id: "roleCreated", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`roleCreated_${req.params.guildID}.channel`, req.body.sData.roleCreated.channel);
        db.set(`roleCreated_${req.params.guildID}.enabled`, req.body.sData.roleCreated.enabled);
        db.set(`roleCreated_${req.params.guildID}.color`, req.body.sData.roleCreated.color);
        errors.push({success: true, id: "roleCreated"});
      }
      //role deleted
      if(req.body.sData.roleDeleted.channel && !client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.sData.roleDeleted.channel)){
        errors.push({success: false, id: "roleDeleted", message: "Error: Unknown channel (refresh the page and try again)"});
      }else if(req.body.sData.roleDeleted.channel && client.channels.cache.get(req.body.sData.roleDeleted.channel).type !== "GUILD_TEXT"){
        errors.push({success: false, id: "roleDeleted", message: "Error: Unknown channel type (refresh the page and try again)"});
      }else if(req.body.sData.roleDeleted.channel && !client.channels.cache.get(req.body.sData.roleDeleted.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        errors.push({success: false, id: "roleDeleted", message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"});
      }else if(req.body.sData.roleDeleted.enabled === "true" && !req.body.sData.roleDeleted.channel){
        errors.push({success: false, id: "roleDeleted", message: "Error: You must to select a channel (or uncheck the checkbox)"});
      }else{
        db.set(`roleDeleted_${req.params.guildID}.channel`, req.body.sData.roleDeleted.channel);
        db.set(`roleDeleted_${req.params.guildID}.enabled`, req.body.sData.roleDeleted.enabled);
        db.set(`roleDeleted_${req.params.guildID}.color`, req.body.sData.roleDeleted.color);
        errors.push({success: true, id: "roleDeleted"});
      }
      await res.send(errors)
    }
  }else if(req.params.category.toLowerCase() === "moderation"){
    if(req.body.prefix){ //prefix
      db.set(`prefix_${req.params.guildID}`, req.body.prefix);
      var prefix = {success: true};
    }else{
      db.set(`prefix_${req.params.guildID}`, "!");
      var prefix = {success: true};
    };
    if(req.body.muteRole){ //mute role
      let muteRole = client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.muteRole);
      if(!muteRole || !muteRole.editable || muteRole.id === client.guilds.cache.get(req.params.guildID).roles.everyone.id){
        var mute = {success: false, message: "Error: Unknown role (refresh the page and try again)"};
      }else if(muteRole.position > client.guilds.cache.get(req.params.guildID).me.roles.highest.position){
        var mute = {success: false, message: "Error: The bot must to be above the role"};
      }else{
        db.set(`muterole_${req.params.guildID}`, req.body.muteRole);
        var mute = {success: true};
      };
    }else{
      db.delete(`muterole_${req.params.guildID}`);
      var mute = {success: true};
    };
    
    if(req.body.welcomeChannel){ //welcome channel
      if(!client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.welcomeChannel)){
        var welcomeChannel = {success: false, message: "Error: Unknown channel (refresh the page and try again)"};
      }else if(client.channels.cache.get(req.body.welcomeChannel).type !== "GUILD_TEXT"){
        var welcomeChannel = {success: false, message: "Error: Unknown channel type (refresh the page and try again)"};
      }else if(!client.channels.cache.get(req.body.welcomeChannel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        var welcomeChannel = {success: false, message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"};
      }else{
        db.set(`welcome_${req.params.guildID}`, req.body.welcomeChannel);
        var welcomeChannel = {success: true};
      };
    }else{
      db.delete(`welcome_${req.params.guildID}`);
      var welcomeChannel = {success: true};
    };
    if(req.body.modlogchannel){ //mod log channel
      if(!client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.modlogchannel)){
        var modlogchannel = {success: false, message: "Error: Unknown channel (refresh the page and try again)"};
      }else if(client.channels.cache.get(req.body.modlogchannel).type !== "GUILD_TEXT"){
        var modlogchannel = {success: false, message: "Error: Unknown channel type (refresh the page and try again)"};
      }else if(!client.channels.cache.get(req.body.modlogchannel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
        var modlogchannel = {success: false, message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"};
      }else{
        db.set(`modlog_${req.params.guildID}`, req.body.modlogchannel);
        var modlogchannel = {success: true};
      };
    }else{
      db.delete(`modlog_${req.params.guildID}`);
      var modlogchannel = {success: true};
    };
    if(req.body.anitbadwords){ //anti bad words
      db.delete(`anitbadwords_${req.params.guildID}`);
      await req.body.anitbadwords.forEach(w => {
        let data = {
          swearword: w,
          author: `${res.locals.user.username}#${res.locals.user.discriminator}`,
        };
        db.push(`anitbadwords_${req.params.guildID}`, data);
      });
      var anitbadwords = {success: true};
    }else{
      db.delete(`anitbadwords_${req.params.guildID}`);
      var anitbadwords = {success: true};
    };
    await res.send({mute: mute, prefix: prefix, welcomeChannel: welcomeChannel, modlogchannel: modlogchannel, anitbadwords: anitbadwords});
  }else if(req.params.category.toLowerCase() === "levels"){//-----levels
    let errors = [];
    await RoleReward.deleteOne({guildId: req.params.guildID});
    const settings = await RankSettings.findOneAndUpdate({guildId: req.params.guildID}, {guildId: req.params.guildID}, {upsert: true, new:true});
    let { ModuleIs, DoubleXp } = settings;
    try{// mode
      if(req.body.mode === "true"){
        ModuleIs = 1;
        await RankSettings.updateOne({ guildId: req.params.guildID }, {ModuleIs, DoubleXp});
        var mode = {success: true};
      }else{
        ModuleIs = 0;
        await RankSettings.updateOne({ guildId: req.params.guildID }, {ModuleIs, DoubleXp});
        var mode = {success: true};
      };
    }catch(e){
      var mode = {success: false, message: "Unknown error"};
    }
    try{// double xp
      if(req.body.doublexp === "true"){
        DoubleXp = 1;
        await RankSettings.updateOne({ guildId: req.params.guildID }, {ModuleIs, DoubleXp});
        var doublexp = {success: true};
      }else{
        DoubleXp = 0;
        await RankSettings.updateOne({ guildId: req.params.guildID }, {ModuleIs, DoubleXp});
        var doublexp = {success: true};
      };
    }catch(e){
      var doublexp = {success: false, message: "Unknown error"};
    }
    if(req.body.data){
      let i = 0;
      req.body.data.forEach(async c => {
        i++
        if(!c.role || !c.level || !c.id){
          errors.push({success: false, number: i, message: "Error: You must specify a role level and id"});
        }else if(!client.guilds.cache.get(req.params.guildID).roles.cache.get(String(c.role))  || !client.guilds.cache.get(req.params.guildID).roles.cache.get(String(c.role)).editable || String(c.role) === client.guilds.cache.get(req.params.guildID).roles.everyone.id){
          errors.push({success: false, number: i, message: "Error: Unknown role (refresh the page and try again)"});
        }else if(client.guilds.cache.get(req.params.guildID).roles.cache.get(String(c.role)).position > client.guilds.cache.get(req.params.guildID).me.roles.highest.position){
          errors.push({success: false, number: i, message: "Error: The bot must to be above the role"});
        }else if(c.level < 1){
          errors.push({success: false, number: i, message: "Error: You must provide a number as a level"});
        }else if(c.id.length !== 2){
          errors.push({success: false, number: i, message: "Error: You need to provide a reward Id of 2 letters or numbers or symbols"});
        }else{
          await RoleReward.findOneAndUpdate({
            guildId: req.params.guildID,
          }, {
            guildId: req.params.guildID,
            $push: {
              RoleReward: {
                roleId: String(c.role),
                requiredLevel: c.level,
                RewardPass: c.id.toUpperCase()
              }
            }
          }, {
            upsert: true,
            new: true
          })
          errors.push({success: true});
        }
      })
    }else{
      await Data.deleteOne({ guildId: req.params.guildID });
      errors.push({success: true});
    }
    setTimeout(() => {
      res.send({mode: mode, doublexp: doublexp, roles: errors});
     }, 500);
  }else if(req.params.category.toLowerCase() === "names"){
    if(req.body.data){
      await Data.deleteOne({ guildId: req.params.guildID });
      await Data.create({
        guildId: req.params.guildID,
        Roles: []
      });
      let i = -1;
      let errors = [];
      let guild = client.guilds.cache.get(req.params.guildID);
      req.body.data.forEach(async c => {
        i++
        if(!c.name || !c.role){
          errors.push({success: false, number: i, message: "Error: You must specify a role and name"});
        }else if(!guild.roles.cache.get(String(c.role)) || guild.roles.cache.get(String(c.role)).tags?.botId || String(c.role) === guild.roles.everyone.id){
          errors.push({success: false, number: i, message: "Error: Unknown role (refresh the page and try again)"});
        }else if(guild.roles.cache.get(String(c.role)).position > guild.me.roles.highest.position){
          errors.push({success: false, number: i, message: "Error: The bot must to be above the role"});
        }else{
          await Data.findOneAndUpdate({ guildId: req.params.guildID }, {
            $push: {
              Roles: {
                RoleId: String(c.role),
                RoleTransforment: c.name
              }
            }
          })
          errors.push({success: true});
        }
      })
     setTimeout(() => {
      res.send(errors);
     }, 500);
    }else{
      await Data.deleteOne({ guildId: req.params.guildID });
      res.send([{success: true}]);
    }
  }else if(req.params.category.toLowerCase() === "custom"){
    if(premiumPages.includes(req.params.category.toLowerCase()) && !db.get(`premium_${req.params.guildID}`)) return res.send({failed: true, error: "Premium is not enabled"});
    if(req.body.type === "create"){//create new
      if(!req.body.command){
        return res.send({success: false, id: "create", type: "command", message: "Error: You must specify command"})
      }else if(!req.body.message){
        return res.send({success: false, id: "create", type: "message", message: "Error: You must specify message"});
      }else if(req.body.cooldown === "true" && req.body.hours === "0" && req.body.minutes === "0" && req.body.seconds === "0"){
        return res.send({success: false, id: "create", type: "time", message: "Error: You must select time"});
      }else if(req.body.cooldown === "true" && ms(`${req.body.hours}h`) === undefined || ms(`${req.body.minutes}m`) === undefined || ms(`${req.body.seconds}s`) === undefined){
        return res.send({success: false, id: "create", type: "time", message: "Error: You must enter vailed time"});
      }else if(req.body.cooldown === "true" && (ms(`${req.body.hours}h`) + ms(`${req.body.minutes}m`) + ms(`${req.body.seconds}s`)) > 86400000){
        return res.send({success: false, id: "create", type: "time", message: "Error: The max time is 24 hours"});
      }else{
        let data = {
          id: req.body.id,
          command: req.body.command,
          message: req.body.message,
          cooldown: req.body.cooldown,
          time: {
            hours: req.body.hours,
            minutes: req.body.minutes,
            seconds: req.body.seconds
          }
        };
        
        db.push(`customcommands_${req.params.guildID}`, data);
        db.set(`customcommands_${req.params.guildID}_${req.body.id}`, "true")
        res.send({success: true, id: req.body.id, command: req.body.command, message: req.body.message, cooldown: req.body.cooldown, time: {hours: req.body.hours,minutes: req.body.minutes,seconds: req.body.seconds
        }});
      }
    }else if(req.body.type === "delete"){//delete
      let data = db.get(`customcommands_${req.params.guildID}`)
      db.delete(`customcommands_${req.params.guildID}`)
      data.forEach(d => {
        if(parseInt(d.id) === parseInt(req.body.id)) return;
        db.push(`customcommands_${req.params.guildID}`, d)
      })
      res.send({success: true})
    }else if(req.body.type === "edit"){//edit
      if(!req.body.command){
        return res.send({success: false, id: req.body.id, type: "command", message: "Error: You must specify command"})
      }else if(!req.body.message){
        return res.send({success: false, id: req.body.id, type: "message", message: "Error: You must specify message"});
      }else if(req.body.cooldown === "true" && req.body.hours === "0" && req.body.minutes === "0" && req.body.seconds === "0"){
        return res.send({success: false, id: req.body.id, type: "time", message: "Error: You must select time"});
      }else if(req.body.cooldown === "true" && ms(`${req.body.hours}h`) === undefined || ms(`${req.body.minutes}m`) === undefined || ms(`${req.body.seconds}s`) === undefined){
        return res.send({success: false, id: req.body.id, type: "time", message: "Error: You must enter vailed time"});
      }else if(req.body.cooldown === "true" && (ms(`${req.body.hours}h`) + ms(`${req.body.minutes}m`) + ms(`${req.body.seconds}s`)) > 86400000){
        return res.send({success: false, id: req.body.id, type: "time", message: "Error: The max time is 24 hours"});
      }else{
        let data = db.get(`customcommands_${req.params.guildID}`)
        db.delete(`customcommands_${req.params.guildID}`)
        data.forEach(d => {
          if(d.id === req.body.id){
            let data = {
              id: req.body.id,
              command: req.body.command,
              message: req.body.message,
              cooldown: req.body.cooldown,
              time: {
                hours: req.body.hours,
                minutes: req.body.minutes,
                seconds: req.body.seconds
              }
            };
            db.push(`customcommands_${req.params.guildID}`, data)
          }else{
            db.push(`customcommands_${req.params.guildID}`, d)
          }
        })
        res.send({success: true})
      }
    }else if(req.body.type === "update"){//update enable
      req.body.data.forEach(r => {
        db.set(`customcommands_${req.params.guildID}_${r.id}`, r.enabled)
      })
      res.send({success: true})
    }
    // if(req.body.data){ //custom commands
    //   db.delete(`customcommands_${req.params.guildID}`);
    //   let i = -1;
    //   let errors = [];
    //   req.body.data.forEach(c => {
    //     i++
    //     if(!c.command){
    //       errors.push({success: false, number: i, message: "Error: You must specify command"});
    //     }else if(!c.message){
    //       errors.push({success: false, number: i, message: "Error: You must specify message"});
    //     }else{
    //       let data = {
    //         command: c.command,
    //         message: c.message,
    //       };
    //       db.push(`customcommands_${req.params.guildID}`, data);
    //       errors.push({success: true});
    //     }
    //   });
    //   setTimeout(() => {
    //     res.send(errors);
    //    }, 500);
    // }else{
    //   db.delete(`customcommands_${req.params.guildID}`);
    //   res.send([{success: true}]);
    // };
  }else if(req.params.category.toLowerCase() === "verification"){
    if(req.body.option === "1"){
      if(req.body.enabled === "true"){
        db.set(`verificationEnabled_${req.params.guildID}`, true);
      }else{
        db.delete(`verificationEnabled_${req.params.guildID}`);
      };
      
      if(req.body.role){
        if(!client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.role) || !client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.role).editable || req.body.role === client.guilds.cache.get(req.params.guildID).roles.everyone.id){
          var roleError = {success: false, message: "Error: Unknown role (refresh the page and try again)"};
        }else if(client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.role).position > client.guilds.cache.get(req.params.guildID).me.roles.highest.position){
          var roleError = {success: false, message: "Error: The bot must to be above the role"};
        }else{
          db.set(`verificationRole_${req.params.guildID}`, req.body.role);
          var roleError = {success: true};
        };
      }else if(!req.body.role && req.body.enabled === "true"){
        var roleError = {success: false, message: "Error: You must to select a role"};
      }else{
        db.delete(`verificationRole_${req.params.guildID}`);
        var roleError = {success: true};
      };

      if(req.body.message){
        db.set(`verificationMessage_${req.params.guildID}`, req.body.message);
        var messageError = {success: true};
      }else if(!req.body.message && req.body.enabled === "true"){
        var messageError = {success: false, message: "Error: You must to enter a message"};
      }else{
        db.delete(`verificationMessage_${req.params.guildID}`);
        var messageError = {success: true};
      }

      if(req.body.channel){
        if(!client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.channel)){
          var channelError = {success: false, message: "Error: Unknown channel (refresh the page and try again)"};
        }else if(client.channels.cache.get(req.body.channel).type !== "GUILD_TEXT"){
          var channelError = {success: false, message: "Error: Unknown channel type (refresh the page and try again)"};
        }else if(!client.channels.cache.get(req.body.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
          var channelError = {success: false, message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"};
        }else{
          db.set(`verificationChannel_${req.params.guildID}`, req.body.channel);
          if(req.body.channel && req.body.role && req.body.message && req.body.enabled === "true"){
            client.channels.cache.get(req.body.channel).send(db.get(`verificationMessage_${req.params.guildID}`));
          }
          var channelError = {success: true};
        };
      }else if(!req.body.channel && req.body.enabled === "true"){
        var channelError = {success: false, message: "Error: You must to select a channel"};
      }else{
        db.delete(`verificationChannel_${req.params.guildID}`);
        var channelError = {success: true};
      };

      if(roleError.success && messageError.success && channelError.success){
        db.set(`verificationOption_${req.params.guildID}`, "1");
      }

      await res.send({option: "1", role: roleError, message: messageError, channel: channelError});
    }else if(req.body.option === "2"){
      if(req.body.enabled === "true"){
        db.set(`verificationEnabled_${req.params.guildID}`, true);
      }else{
        db.delete(`verificationEnabled_${req.params.guildID}`);
      };
      
      if(req.body.role){
        if(!client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.role) || !client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.role).editable || req.body.role === client.guilds.cache.get(req.params.guildID).roles.everyone.id){
          var roleError = {success: false, message: "Error: Unknown role (refresh the page and try again)"};
        }else if(client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.role).position > client.guilds.cache.get(req.params.guildID).me.roles.highest.position){
          var roleError = {success: false, message: "Error: The bot must to be above the role"};
        }else{
          db.set(`verificationRole_${req.params.guildID}`, req.body.role);
          var roleError = {success: true};
        };
      }else if(!req.body.role && req.body.enabled === "true"){
        var roleError = {success: false, message: "Error: You must to select a role"};
      }else{
        db.delete(`verificationRole_${req.params.guildID}`);
        var roleError = {success: true};
      };

      if(req.body.message){
        db.set(`verificationMessage_${req.params.guildID}`, req.body.message);
        var messageError = {success: true};
      }else if(!req.body.message && req.body.enabled === "true"){
        var messageError = {success: false, message: "Error: You must to enter a message"};
      }else{
        db.delete(`verificationMessage_${req.params.guildID}`);
        var messageError = {success: true};
      }

      if(req.body.buttonText){
        db.set(`verificationButtonText_${req.params.guildID}`, req.body.buttonText);
        var buttonTextError = {success: true};
      }else if(!req.body.buttonText && req.body.enabled === "true"){
        var buttonTextError = {success: false, message: "Error: You must to enter button text"};
      }else{
        db.delete(`verificationButtonText_${req.params.guildID}`);
        var buttonTextError = {success: true};
      }

      if(req.body.buttonColor){
        db.set(`verificationButtonColor_${req.params.guildID}`, req.body.buttonColor);
        var buttonColorError = {success: true};
      }else if(!req.body.buttonColor && req.body.enabled === "true"){
        var buttonColorError = {success: false, message: "Error: You must to select a button color"};
      }else{
        db.delete(`verificationButtonColor_${req.params.guildID}`);
        var buttonColorError = {success: true};
      }

      if(req.body.channel){
        if(!client.guilds.cache.get(req.params.guildID).channels.cache.get(req.body.channel)){
          var channelError = {success: false, message: "Error: Unknown channel (refresh the page and try again)"};
        }else if(client.channels.cache.get(req.body.channel).type !== "GUILD_TEXT"){
          var channelError = {success: false, message: "Error: Unknown channel type (refresh the page and try again)"};
        }else if(!client.channels.cache.get(req.body.channel).permissionsFor(client.user).has(["SEND_MESSAGES", "VIEW_CHANNEL"])){
          var channelError = {success: false, message: "Error: Bot does not have permissions for this channel (Try to give the bot administrator permissions)"};
        }else{
          db.set(`verificationChannel_${req.params.guildID}`, req.body.channel);
          if(req.body.channel && req.body.role && req.body.message && req.body.buttonText && req.body.buttonColor && req.body.enabled === "true"){
            let row = new discord.MessageActionRow().addComponents(
              new discord.MessageButton()
              .setCustomId('verify')
              .setLabel(req.body.buttonText)
              .setStyle(req.body.buttonColor)
            );

            client.channels.cache.get(req.body.channel).send({content: db.get(`verificationMessage_${req.params.guildID}`), components: [row] });
          }
          var channelError = {success: true};
        };
      }else if(!req.body.channel && req.body.enabled === "true"){
        var channelError = {success: false, message: "Error: You must to select a channel"};
      }else{
        db.delete(`verificationChannel_${req.params.guildID}`);
        var channelError = {success: true};
      };

      if(roleError.success && messageError.success && channelError.success && buttonTextError.success && buttonColorError.success){
        db.set(`verificationOption_${req.params.guildID}`, "2");
      }
      
      await res.send({option: "2", role: roleError, message: messageError, channel: channelError, buttonText: buttonTextError, buttonColor: buttonColorError});
    }
  }else if(req.params.category.toLowerCase() === "coins"){
    if(req.body.type === "settings"){
      const guildDB = await guildsConfig.get(req.params.guildID);
      
      if(req.body.mode === "true"){
        guildDB["coinModule"] = true;
      }else{
        guildDB["coinModule"] = false;
      }
      
      if(!req.body.coins){
        var coinsError = {success: false, message: "Error: You must to provide the amount you want to set per message."};
      }else if(isNaN(req.body.coins)){
        var coinsError = {success: false, message: "Error: You must to provide a valid number for the amount."};
      }else if(req.body.coins < 5){
        var coinsError = {success: false, message: "Error: You must to provide a number higher then 5."};
      }else if(req.body.coins > 50000000){
        var coinsError = {success: false, message: "Error: You must to provide a number lower then 50000000."};
      }else{
        guildDB.coinPerMsg = Number(req.body.coins);
        var coinsError = {success: true};
      }

      if(!req.body.daily.min){
        var dailyMinError = {success: false, message: "Error: You must to provide the amount you want to set per message."};
      }else if(isNaN(req.body.daily.min)){
        var dailyMinError = {success: false, message: "Error: You must to provide a valid number for the amount."};
      }else if(req.body.daily.min < 5){
        var dailyMinError = {success: false, message: "Error: You must to provide a number higher then 5."};
      }else if(req.body.daily.min > 50000000){
        var dailyMinError = {success: false, message: "Error: You must to provide a number lower then 50000000."};
      }else{
        guildDB.coinDaily.min = Number(req.body.daily.min);
        var dailyMinError = {success: true};
      }

      if(!req.body.daily.max){
        var dailyMaxError = {success: false, message: "Error: You must to provide the amount you want to set per message."};
      }else if(isNaN(req.body.daily.max)){
        var dailyMaxError = {success: false, message: "Error: You must to provide a valid number for the amount."};
      }else if(req.body.daily.max < 5){
        var dailyMaxError = {success: false, message: "Error: You must to provide a number higher then 5."};
      }else if(req.body.daily.max > 50000000){
        var dailyMaxError = {success: false, message: "Error: You must to provide a number lower then 50000000."};
      }else{
        guildDB.coinDaily.max = Number(req.body.daily.max);
        var dailyMaxError = {success: true};
      }

      await guildDB.save();
      await res.send({coins: coinsError, daily: {min: dailyMinError, max: dailyMaxError}});
    }else if(req.body.type === "create"){
      const guildDB = await guildsConfig.get(req.params.guildID);

      if(!db.get(`premium_${req.params.guildID}`) && guildDB.coinsShop.length >= 7) return res.send({failed: true, error: "You can't add more than 7 items", items: {max: db.get(`premium_${req.params.guildID}`) ? "unlimited" : "7", total: guildDB.coinsShop.length}});

      let role = client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.role);
      if(!req.body.role){
        var roleError = {success: false, message: "Error: You must to select role."};
      }else if(!role || !role.editable || role.id === client.guilds.cache.get(req.params.guildID).roles.everyone.id){
        var roleError = {success: false, message: "Error: Unknown role (refresh the page and try again)."};
      }else if(role.position > client.guilds.cache.get(req.params.guildID).me.roles.highest.position){
        var roleError = {success: false, message: "Error: The bot must to be above the role."};
      }else if(guildDB.coinsShop.find(element => element.RoleID === role.id)){
        var roleError = {success: false, message: "Error: You can't use the same role twice."};
      }else{
        var roleError = {success: true};
      };

      if(!req.body.price){
        var priceError = {success: false, message: "Error: You must to provide a price."};
      }else if(isNaN(req.body.price)){
        var priceError = {success: false, message: "Error: You must to provide a valid number of price."};
      }else if(req.body.price < 10){
        var priceError = {success: false, message: "Error: You must to provide a number higher then 10."};
      }else if(req.body.price > 999999999999){
        var priceError = {success: false, message: "Error: You must to provide a number lower then 999999999999."};
      }else{
        var priceError = {success: true};
      }
      
			if(roleError.success && priceError.success && req.body.id){
        while(guildDB.coinsShop.find(element => element.id === req.body.id)){
          req.body.id = (Math.floor(Math.random() * (999999999 - 0)) + 0).toString();
        }
        if(!guildDB.coinsShop) {
          guildDB.coinsShop = [];
          guildDB.coinsShop.push({RoleID: req.body.role, price: req.body.price, id: req.body.id});
          guildDB.save();
        }else{
          guildDB.coinsShop.push({RoleID: req.body.role, price: req.body.price, id: req.body.id});
          guildDB.save();
        }

        res.send({
          success: true,
          id: req.body.id,
          price: req.body.price,
          role: {
            id: req.body.role,
            name: role.name,
            color: role.hexColor
          },
          items: {
            max: db.get(`premium_${req.params.guildID}`) ? "unlimited" : "7",
            total: guildDB.coinsShop.length
          }
        });
      }else{
        res.send({success: false, role: roleError, price: priceError});
      }
    }else if(req.body.type === "edit"){
      const guildDB = await guildsConfig.get(req.params.guildID);
      
      let role = client.guilds.cache.get(req.params.guildID).roles.cache.get(req.body.role);
      if(!req.body.role){
        var roleError = {success: false, message: "Error: You must to select role."};
      }else if(!role || !role.editable || role.id === client.guilds.cache.get(req.params.guildID).roles.everyone.id){
        var roleError = {success: false, message: "Error: Unknown role (refresh the page and try again)."};
      }else if(role.position > client.guilds.cache.get(req.params.guildID).me.roles.highest.position){
        var roleError = {success: false, message: "Error: The bot must to be above the role."};
      }else if(guildDB.coinsShop.find(element => element.RoleID === role.id)?.id && guildDB.coinsShop.find(element => element.RoleID === role.id)?.id !== req.body.id){
        var roleError = {success: false, message: "Error: You can't use the same role twice."};
      }else{
        var roleError = {success: true};
      };

      if(!req.body.price){
        var priceError = {success: false, message: "Error: You must to provide a price."};
      }else if(isNaN(req.body.price)){
        var priceError = {success: false, message: "Error: You must to provide a valid number of price."};
      }else if(req.body.price < 10){
        var priceError = {success: false, message: "Error: You must to provide a number higher then 10."};
      }else if(req.body.price > 999999999999){
        var priceError = {success: false, message: "Error: You must to provide a number lower then 999999999999."};
      }else{
        var priceError = {success: true};
      }
      
      if(!guildDB.coinsShop.filter(item => item.id === req.body.id).length) return res.send({failed: true, error: "Unknown item"});
			if(roleError.success && priceError.success && req.body.id){

        let index = guildDB.coinsShop.findIndex(item => item.id === req.body.id);

        guildDB.coinsShop.set(index, {RoleID: req.body.role, price: req.body.price, id: req.body.id});
      
        guildDB.save();

        res.send({
          success: true,
          color: role.hexColor,
          role: role.name,
          price: req.body.price,
          items: {
            max: db.get(`premium_${req.params.guildID}`) ? "unlimited" : "7",
            total: guildDB.coinsShop.length
          }
        });
      }else{
        res.send({success: false, role: roleError, price: priceError});
      }
    }else if(req.body.type === "delete"){
      if(!req.body.id) return res.send({success: false});
      const guildDB = await guildsConfig.get(req.params.guildID);
      
      if(!guildDB.coinsShop.filter(item => item.id === req.body.id).length) return res.send({success: false});
      guildDB.coinsShop.splice(guildDB.coinsShop.findIndex(item => item.id === req.body.id), 1);
      guildDB.save();
      res.send({
        success: true,
        items: {
          max: db.get(`premium_${req.params.guildID}`) ? "unlimited" : "7",
          total: guildDB.coinsShop.length
        }
      });
    }else if(req.body.type === "getItemsLength"){
      const guildDB = await guildsConfig.get(req.params.guildID);
      
      res.send({
        success: db.get(`premium_${req.params.guildID}`) ? true : guildDB.coinsShop.length >= 7 ? false : true,
        items: {
          max: db.get(`premium_${req.params.guildID}`) ? "unlimited" : "7",
          total: guildDB.coinsShop.length
        }
      });
    }
  };
});

router.get("/:guildID", checkAuth, get, async (req, res) => {
  res.cookie("previousPage",  req.originalUrl);
  if(res.locals.user === null) return res.redirect(`/login?guild=${req.params.guildID}`);
  let server = client.guilds.cache.get(req.params.guildID);
  let admins = JSON.parse(fs.readFileSync("./config.json").toString()).admins;
  let guilds = res.guilds 

  try{
    if(!server && guilds.get(req.params.guildID)){
      res.clearCookie('previousPage');
      return res.redirect(`/invite?guild=${req.params.guildID}`);
    }else if(!server && !guilds.get(req.params.guildID)){
      res.clearCookie('previousPage');
      return res.redirect("../servers")
    }else if(!admins.includes(res.locals.user.id) && !guilds.get(req.params.guildID)?.permissions.includes('MANAGE_GUILD')){
      res.clearCookie('previousPage');
      return res.redirect(`../servers`);
    };
  }catch{
    res.clearCookie('previousPage');
    res.redirect("../servers");
  }
  res.render("server", {
    bot: client,
    admin: res.locals.user ? admins.includes(res.locals.user.id) : false,
    premium: db.fetch(`premium_${req.params.guildID}`),
    guild: server,
    icon: guilds.get(req.params.guildID).iconHash ? server.iconURL() : null
  });
});

module.exports = router;