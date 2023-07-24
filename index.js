const {
  Client,
  MessageAttachment,
  Collection,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Intents
} = require("discord.js");
const { PREFIX, DBL_API_KEY } = require("./bot/config");
const bot = new Client({ disableMentions: "everyone", intents: [Intents.FLAGS.GUILDS, "GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MEMBERS", "GUILD_VOICE_STATES", "GUILD_MESSAGE_REACTIONS"] });
const fs = require("fs");
const ms = require("ms")
const db = require("quick.db");
const jimp = require("jimp");
const prettyMilliseconds = require('pretty-ms');
const mongoose = require(`mongoose`);
const config = require("./config.json");


bot.phone = new Collection();
bot.commands = new Collection();
bot.aliases = new Collection();

["aliases", "commands"].forEach(x => (bot[x] = new Collection()));
["console", "command", "event"].forEach(x => require(`./bot/handler/${x}`)(bot));

bot.categories = fs.readdirSync("./bot/commands/");
bot.on("messageCreate", async message => {
  if(!message.guild || message.author.bot) return;

  let prefix = db.get(`prefix_${message.guild.id}`)
  if(prefix === null) prefix = PREFIX;
  
  if(!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
});

["command"].forEach(handler => {
  require(`./bot/handler/${handler}`)(bot);
});
mongoose.connect(
  "mongodb+srv://admin:8xXsyvgPl8jAdbRL@cluster0.ndhg5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex:true
  }
);

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason.stack || reason)
})

bot.on("messageCreate", async message => {
  if(!message.guild || message.author.bot) return;
  let prefix;
  try {
    let fetched = await db.fetch(`prefix_${message.guild.id}`);
    if (fetched == null) {
      prefix = PREFIX;
    } else {
      prefix = fetched;
    }
  } catch (e) {
    console.log(e);
  }
if(!message.author.bot) {
      try {
    if (
      message.mentions.has(bot.user) &&
      !message.mentions.has(message.guild.id)
    ) {
      return message.channel.send(
        `**My Prefix In This Server is - \`${prefix}\`**`
      );
    }
  } catch {
    return;
  }
}
});
const { DiscordTogether } = require('discord-together');

bot.discordTogether = new DiscordTogether(bot);

bot.on('messageCreate', async message => {
  if(!message.guild || message.author.bot) return;
  let prefix;
  let fetched = await db.fetch(`prefix_${message.guild.id}`);

  if(fetched === null){
    prefix = PREFIX
  }else{
    prefix = fetched
  }

  let args = message.content.slice(prefix.length).split(/ +/)
  let command = args.shift().toLowerCase()
  
  if(command === 'start-fishing'){
    if(!message.member.voice.channel) return message.channel.send("You need to be in the Voice To Play A Game!")
      if(message.member.voice.channel) {
        bot.discordTogether.createTogetherCode(message.member.voice.channel.id, 'fishing').then(async invite => {
        let embed = new MessageEmbed()
        .setColor('#5865F2')
        .setDescription(`Thank you for choosing keybot [Click here to play](${invite.code})`)
        message.channel.send({ embeds: [embed] });
      });
    };
  };
});

bot.on('messageCreate', async message => {
  if(!message.guild || message.author.bot) return;
  let prefix;
  let fetched = await db.fetch(`prefix_${message.guild.id}`);

  if(fetched === null){
    prefix = PREFIX
  }else{
    prefix = fetched
  }

  let args = message.content.slice(prefix.length).split(/ +/)
  let command = args.shift().toLowerCase()

  if(command === 'start-chess') {
    if(!message.member.voice.channel) return message.channel.send("You need to be in the Voice To Play A Game!")
      if(message.member.voice.channel) {
        bot.discordTogether.createTogetherCode(message.member.voice.channel.id, 'chess').then(async invite => {
        let embed = new MessageEmbed()
        .setColor('#5865F2')
        .setDescription(`Thank you for choosing keybot [Click here to play](${invite.code})`)
        message.channel.send({ embeds: [embed]});
      });
    };
  };
});

bot.on('messageCreate', async message => {
  if(!message.guild || message.author.bot) return;
  let prefix;
  let fetched = await db.fetch(`prefix_${message.guild.id}`);

  if(fetched === null){
    prefix = PREFIX
  }else{
    prefix = fetched
  }

  let args = message.content.slice(prefix.length).split(/ +/)
  let command = args.shift().toLowerCase()

  if (command === 'start-poker') {
    if(!message.member.voice.channel) return message.channel.send("You need to be in the Voice To Play A Game!")
      if(message.member.voice.channel) {
        bot.discordTogether.createTogetherCode(message.member.voice.channel.id, 'poker').then(async invite => {
        let embed = new MessageEmbed()
        .setColor('#5865F2')
        .setDescription(`Thank you for choosing keybot [Click here to play](${invite.code})`)
        message.channel.send({ embeds: [embed]});
      });
    };
  };
});

bot.on('messageCreate', async message => {
  if(!message.guild || message.author.bot) return;
  let prefix;
  let fetched = await db.fetch(`prefix_${message.guild.id}`);

  if(fetched === null){
    prefix = PREFIX
  }else{
    prefix = fetched
  }

  let args = message.content.slice(prefix.length).split(/ +/)
  let command = args.shift().toLowerCase()

  if(command === 'start-betrayal'){
    if(!message.member.voice.channel) return message.channel.send("You need to be in the Voice To Play A Game!")
      if(message.member.voice.channel) {
        bot.discordTogether.createTogetherCode(message.member.voice.channel.id, 'betrayal').then(async invite => {
        let embed = new MessageEmbed()
        .setColor('#5865F2')
        .setDescription(`Thank you for choosing keybot [Click here to play](${invite.code})`)
				message.channel.send({ embeds: [embed]});
      });
    };
  };
});

bot.on('messageCreate', async message => {
  if(!message.guild || message.author.bot) return;
  let prefix;
  let fetched = await db.fetch(`prefix_${message.guild.id}`);

  if(fetched === null){
    prefix = PREFIX
  }else{
    prefix = fetched
  }

  let args = message.content.slice(prefix.length).split(/ +/)
  let command = args.shift().toLowerCase()

  if(command === 'start-youtube'){
    if(!message.member.voice.channel) return message.channel.send("You need to be in the Voice To Play A Game!")
      if(message.member.voice.channel) {
        bot.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
        let embed = new MessageEmbed()
        .setColor('#5865F2')
        .setDescription(`Thank you for choosing keybot [Click here to play](${invite.code})`)
        message.channel.send({ embeds: [embed]});
      });
    };
  };
});

 
bot.on("ready", async () => {
  const upchannel = bot.channels.cache.get("771731703517282314");
  const upembed = new MessageEmbed()
    .setThumbnail(bot.user.avatarURL())
    .setTitle("Bot restart Notification")
    .setDescription("im here !");
  upchannel.send({ embeds: [upembed]});
});
/**
bot.on("guildMemberUpdate", async(client, oldMember, newMember) => {
  const Data = require(`./data/schemas/RoleData.js`)
    let data = await Data.findOne({ guildId: newMember.guild.id }, async (err, data) => {
        if(err) return console.log(err);
        if(!data) return;
    })
    
    if(!data || data === null) return

    if (oldMember._roles.length < newMember._roles.length) {
        let roleId = String(newMember._roles.filter(r => !oldMember._roles.includes(r)));
        let RoleObject = await newMember.guild.roles.cache.find(role => role.id === roleId)
        if(!RoleObject) return console.log(`Role not found`);
        
        if(data.Roles === null) return;
        let getData = data.Roles.filter(onedata => {
            if(onedata.RoleId !== RoleObject.id) return;
            let Name = onedata.RoleTransforment;
            let formatedName = Name.replace('{member}', newMember.user.username)
            let memberRolePos = newMember.roles.highest;
            let botRolePos = newMember.guild.me.roles.highest;
            if(botRolePos.rawPosition <= memberRolePos.rawPosition || newMember.guild.ownerID === newMember.id) {
                return console.log("no perms");
            } else {
                if(memberRolePos.rawPosition > RoleObject.rawPosition){
                    return;
                } else {
                    newMember.setNickname(formatedName)
                }
            }
        })
    }
    if (oldMember._roles.length > newMember._roles.length) {
        let roleId = String(oldMember._roles.filter(r => !newMember._roles.includes(r)));
        let RoleObject = await newMember.guild.roles.cache.find(role => role.id === roleId)
        if(!RoleObject) return console.log(`Role not found`);
        let memberRolePos = newMember.roles.highest;
        let botRolePos = newMember.guild.me.roles.highest;
        if(botRolePos.rawPosition <= memberRolePos.rawPosition || newMember.guild.ownerID === newMember.id) {
            return console.log("no perms");
        } else {
            if(memberRolePos.rawPosition > RoleObject.rawPosition){
                return;
            } else {
                newMember.setNickname(newMember.user.username)
            }
        }
        if(data.Roles === null) return;
        data.Roles.filter(r => {
          if(r.RoleId === memberRolePos.id){
            let Name = r.RoleTransforment;
            let formatedName = Name.replace('{member}', newMember.user.username)
            newMember.setNickname(formatedName)
          } else {
                return;
              }
            })
          }
        }) **/
bot.on('messageCreate', message => {
  if(message.author.bot) return;
  if(message.guild) {
    let words = db.get(`anitbadwords_${message.guild.id}`)
            
    if(words && words.find(find => message.content.toLowerCase().includes(find.swearword))) {
      message.delete()
      message.channel.send(`${message.author} The word you said is blocked from ${message.guild.name}/this server`).then(m => setTimeout(() => m.delete(), 5000));
    };
  };
});

bot.on('messageDelete', async message => {
  if (!message.guild || message.author.bot) return;
  if(db.get(`messageDeleted_${message.guild.id}.enabled`) === "false") return;
  if(!db.get(`messageDeleted_${message.guild.id}.channel`)) return;
  let channel = bot.channels.cache.get(db.get(`messageDeleted_${message.guild.id}.channel`))
  if(!channel) return;

  let embed = new MessageEmbed()
  .setColor(db.get(`messageDeleted_${message.guild.id}.color`))
  .setTitle(`Message Deleted!`)
  .addField('Author:', `${message.author}`, true)
  .addField('Channel:', `${message.channel}`, true)
  .addField('Message:', `\`\`\`${message}\`\`\``)
  .setTimestamp(); 
  channel.send({ embeds: [embed]});
}); 

bot.on("messageUpdate", async (oldMessage, newMessage) => {
  if (oldMessage.content.toLowerCase() === newMessage.content.toLowerCase()) return;
  if (!oldMessage.guild || oldMessage.author.bot) return;
  if(db.get(`messageEdited_${oldMessage.guild.id}.enabled`) === "false") return;
  if(!db.get(`messageEdited_${oldMessage.guild.id}.channel`)) return;
  let channel = bot.channels.cache.get(db.get(`messageEdited_${oldMessage.guild.id}.channel`))
  if(!channel) return;
  
  let Embed = new MessageEmbed()
  .setColor(db.get(`messageEdited_${oldMessage.guild.id}.color`))
  .setTitle(`Message Edited!`)
  .addField(`Author:`, `<@${oldMessage.author.id}>`, true)
  .addField(`Channel:`, `${newMessage.channel}`, true)
  .addField(`Message:`, `[Click here](${newMessage.url})`, true)
  .addField(`Old:`, `\`\`\`${oldMessage}\`\`\``)
  .addField(`New:`, `\`\`\`${newMessage}\`\`\``)
  .setTimestamp();
  
  channel.send({ embeds: [Embed]});
});

bot.on("guildMemberAdd", async member => {
  if(db.get(`memberJoined_${member.guild.id}.enabled`) === "false") return;
  if(!db.get(`memberJoined_${member.guild.id}.channel`)) return;
  let channel = bot.channels.cache.get(db.get(`memberJoined_${member.guild.id}.channel`))
  if(!channel) return;
  
  let Embed = new MessageEmbed()
    .setColor(db.get(`memberJoined_${member.guild.id}.color`))
    .setTitle(`Member Joined!`)
    .addField(`Member:`, `${member.user}`, true)
    .addField(`Bot:`, `${member.user.bot}`, true)
    .addField("Created:", `${prettyMilliseconds(Date.now() - member.user.createdTimestamp, {verbose: true})} ago`)
    .setTimestamp();

  channel.send({ embeds: [Embed]})
});

bot.on("guildMemberRemove", async member => {
  if(db.get(`memberLeft_${member.guild.id}.enabled`) === "false") return;
  if(!db.get(`memberLeft_${member.guild.id}.channel`)) return;
  let channel = bot.channels.cache.get(db.get(`memberLeft_${member.guild.id}.channel`))
  if(!channel) return;
  
  let Embed = new MessageEmbed()
    .setColor(db.get(`memberLeft_${member.guild.id}.color`))
    .setTitle(`Member Left!`)
    .addField(`Member:`, `${member.user}`, true)
    .addField("Joined:", `${prettyMilliseconds(Date.now() - member.joinedTimestamp, {verbose: true})} ago`)
    .setTimestamp();
    
    channel.send({ embeds: [Embed]})
});

bot.on(`guildMemberUpdate`, async (oldMember, newMember) => {
  if(db.get(`memberRolesUpdated_${oldMember.guild.id}.enabled`) === "false") return;
  if(!db.get(`memberRolesUpdated_${oldMember.guild.id}.channel`)) return;
  let channel = bot.channels.cache.get(db.get(`memberRolesUpdated_${oldMember.guild.id}.channel`))
  if(!channel) return;

  
  if(!oldMember.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
  let fetchedLogs = await newMember.guild.fetchAuditLogs({
    limit: 1,
    type: 'MEMBER_ROLE_UPDATE',
  });
  let role = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id)).first();
  let memberupdatelog = fetchedLogs.entries.first();
  let { executor, target } = memberupdatelog;
  if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    let embed = new MessageEmbed()
    .setColor(db.get(`memberRolesUpdated_${oldMember.guild.id}.color`))
    .setTitle(`Member Roles Updated!`)
    .addField(`Role Added:`, `${role}`)
    .addField(`Member:`, `${target}`)
    .addField(`By:`, `${executor}`)
    
    channel.send({ embeds: [embed]})
  } 
  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    let role = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id)).first();
    let embed = new MessageEmbed()
    .setColor(db.get(`memberRolesUpdated_${oldMember.guild.id}.color`))
    .setTitle(`Member Roles Updated!`)
    .addField(`Role Removed:`, `${role}`)
    .addField(`Member:`, `${target}`)
    .addField(`By:`, `${executor}`)
    
    channel.send({ embeds: [embed]})
  }
});

bot.on('voiceStateUpdate', async  (voiceOld, voiceNew) => {
  if(!voiceOld.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;

  voiceOld.guild.fetchAuditLogs().then(logs => {
    let userID = logs.entries.first().executor.id;
    // var userTag = logs.entries.first().executor.tag;
    // var userAvatar = logs.entries.first().executor.avatarURL;
    
    // Joined Voice Channel
    if(voiceOld.channel?.id !== voiceNew.channel?.id && !voiceOld.channel) {
      if(db.get(`memberJoinedVoiceChannel_${voiceOld.guild.id}.enabled`) === "false") return;
      if(!db.get(`memberJoinedVoiceChannel_${voiceOld.guild.id}.channel`)) return;
      let channel = bot.channels.cache.get(db.get(`memberJoinedVoiceChannel_${voiceOld.guild.id}.channel`))
      if(!channel) return;

      let voiceJoin = new MessageEmbed()
      .setColor(db.get(`memberJoinedVoiceChannel_${voiceOld.guild.id}.color`))
      .setTitle('Member Joined Voice Channel!')
      .addField('User:', voiceNew.member.toString(), true)
      .addField('Channel:', voiceNew.channel.toString(), true)
      .setTimestamp()
  
      channel.send({ embeds: [voiceJoin]});
    }
    // Leave Voice Channel
    if(voiceOld.channel?.id !== voiceNew.channel?.id && !voiceNew.channel?.id) {
      if(db.get(`memberLeftVoiceChannel_${voiceOld.guild.id}.enabled`) === "false") return;
      if(!db.get(`memberLeftVoiceChannel_${voiceOld.guild.id}.channel`)) return;
      let channel = bot.channels.cache.get(db.get(`memberLeftVoiceChannel_${voiceOld.guild.id}.channel`))
      if(!channel) return;

      let voiceLe = new MessageEmbed()
      .setColor(db.get(`memberLeftVoiceChannel_${voiceOld.guild.id}.color`))
      .setTitle('Member Left Voice Channel!')
      .addField('User:', voiceOld.member.toString(), true)
      .addField('Channel:', voiceOld.channel.toString(), true)
      .setTimestamp()
  
      channel.send({ embeds: [voiceLe]});
    }
    // Server Muted Voice
    if(voiceOld.serverMute === false && voiceNew.serverMute === true) {
      if(db.get(`memberMuted_${voiceOld.guild.id}.enabled`) === "false") return;
      if(!db.get(`memberMuted_${voiceOld.guild.id}.channel`)) return;
      let channel = bot.channels.cache.get(db.get(`memberMuted_${voiceOld.guild.id}.channel`))
      if(!channel) return;
      
      let serverMutev = new MessageEmbed()
      .setColor(db.get(`memberMuted_${voiceOld.guild.id}.color`))
      .setTitle('Member Server Muted!')
      .addField('User:', voiceOld.member.toString(), true)
      .addField('By:', `<@${userID}>`, true)
      .addField('Channel:', voiceOld.channel.toString(), true)
      
      channel.send({ embeds: [serverMutev]});
    }
    // Server UnMuted Voice
    if(voiceOld.serverMute === true && voiceNew.serverMute === false) {
      if(db.get(`memberUnmuted_${voiceOld.guild.id}.enabled`) === "false") return;
      if(!db.get(`memberUnmuted_${voiceOld.guild.id}.channel`)) return;
      let channel = bot.channels.cache.get(db.get(`memberUnmuted_${voiceOld.guild.id}.channel`))
      if(!channel) return;
      
      let serverUnmutev = new MessageEmbed()
      .setColor(db.get(`memberUnmuted_${voiceOld.guild.id}.color`))
      .setTitle('Member Server Unmuted!')
      .addField('User:', voiceOld.member.toString(), true)
      .addField('By:', `<@${userID}>`, true)
      .addField('Channel:', voiceOld.channel.toString(), true)

      channel.send({ embeds: [serverUnmutev]});
    }
    // Server Deafen Voice
    if(voiceOld.serverDeaf === false && voiceNew.serverDeaf === true) {
      if(db.get(`memberMuted_${voiceOld.guild.id}.enabled`) === "false") return;
      if(!db.get(`memberMuted_${voiceOld.guild.id}.channel`)) return;
      let channel = bot.channels.cache.get(db.get(`memberMuted_${voiceOld.guild.id}.channel`))
      if(!channel) return;
      
      let serverDeafv = new MessageEmbed()
      .setColor(db.get(`memberMuted_${voiceOld.guild.id}.color`))
      .setTitle('Member Server Deafened!')
      .addField('User:', voiceOld.member.toString(), true)
      .addField('By:', `<@${userID}>`, true)
      .addField('Channel:', voiceOld.channel.toString(), true)

      channel.send({ embeds: [serverDeafv]});
    }
    // Server Undeafen Voice
    if(voiceOld.serverDeaf === true && voiceNew.serverDeaf === false) {
      if(db.get(`memberUnmuted_${voiceOld.guild.id}.enabled`) === "false") return;
      if(!db.get(`memberUnmuted_${voiceOld.guild.id}.channel`)) return;
      let channel = bot.channels.cache.get(db.get(`memberUnmuted_${voiceOld.guild.id}.channel`))
      if(!channel) return;
      
      let serverUndeafv = new MessageEmbed()
      .setColor(db.get(`memberUnmuted_${voiceOld.guild.id}.color`))
      .setTitle('Voice Server Undeafened!')
      .addField('User:', voiceOld.member.toString(), true)
      .addField('By:', `<@${userID}>`, true)
      .addField('Channel:', voiceOld.channel.toString(), true)

      channel.send({ embeds: [serverUndeafv]});
    }
  })

  // Switched Voice Channel
  if(voiceOld.channel?.id !== voiceNew.channel?.id && voiceNew.channel && voiceOld.channel != null) {
    if(db.get(`memberSwitchedVoiceChannel_${voiceOld.guild.id}.enabled`) === "false") return;
    if(!db.get(`memberSwitchedVoiceChannel_${voiceOld.guild.id}.channel`)) return;
    let channel = bot.channels.cache.get(db.get(`memberSwitchedVoiceChannel_${voiceOld.guild.id}.channel`))
    if(!channel) return;
    
    let voiceLeave = new MessageEmbed()
    .setColor(db.get(`memberSwitchedVoiceChannel_${voiceOld.guild.id}.color`))
    .setTitle('Member Switched Voice Channel!')
    .addField('User:', `${voiceOld.member}`, true)
    .addField('From:', `${voiceOld.channel}`, true)
    .addField('To:', `${voiceNew.channel}`, true)
    .setTimestamp()

    channel.send({ embeds: [voiceLeave]});
  }
});

bot.on("channelCreate", async channel => {
  if(channel.type === "GUILD_CATEGORY" || channel.type === "DM" || channel.type === "UNKNOWN") return;
  
  if(db.get(`channelCreated_${channel.guild.id}.enabled`) === "false") return;
  if(!db.get(`channelCreated_${channel.guild.id}.channel`)) return;
  let Channel = bot.channels.cache.get(db.get(`channelCreated_${channel.guild.id}.channel`))
  if(!Channel) return;

  let Typed;
  if (channel.type === "GUILD_TEXT") {
    Typed = "Text";
  } else if (channel.type === "GUILD_VOICE") {
    Typed = "Voice";
  } else if (channel.type === "GUILD_NEWS") {
    Typed = `News`;
  } else {
    Typed = `Store`;
  }

  let Nsfw;
  let Limit;

  if (channel.type !== "GUILD_VOICE") {
    Nsfw = channel.nsfw ? "Yes" : "No";
  } else {
    Limit = channel.userLimit > 0 ? channel.userLimit : "Unlimited";
  }

  let Pos;
  if (channel.position === "-1") {
    Pos = `Last`;
  } else {
    Pos = channel.position + 1;
  }

  let Embed = new MessageEmbed()
    .setColor(db.get(`channelCreated_${channel.guild.id}.color`))
    .setTitle(`Channel Created!`)
    .addField(`Name:`, channel.name, true)
    .addField(`Type:`, Typed, true)
    .addField(`ID:`, channel.id.toString(), true)
    .addField(`Category:`, channel.parent.toString(), true)
    .addField(`Position:`, Pos.toString(), true)
    .addField(
      `${channel.type !== "GUILD_VOICE" ? "Nsfw" : "Users Limit"}:`,
      `${channel.type !== "GUILD_VOICE" ? Nsfw : Limit}`
    , true)
    .setTimestamp();
    if(channel.type !== "GUILD_VOICE"){
      Embed.addField("Topic:", channel.topic || "No Topic!", true)
    }

  Channel.send({ embeds: [Embed]});
});


bot.on("channelDelete", async channel => {
  if(channel.type === "GUILD_CATEGORY" || channel.type === "DM" || channel.type === "UNKNOWN") return;
  
  if(db.get(`channelDeleted_${channel.guild.id}.enabled`) === "false") return;
  if(!db.get(`channelDeleted_${channel.guild.id}.channel`)) return;
  let Channel = bot.channels.cache.get(db.get(`channelDeleted_${channel.guild.id}.channel`))
  if(!Channel) return;
  
  let Typed;
  if (channel.type === "GUILD_TEXT") {
    Typed = "Text";
  } else if (channel.type === "GUILD_VOICE") {
    Typed = "Voice";
  } else if (channel.type === "GUILD_NEWS") {
    Typed = `News`;
  } else {
    Typed = `Store`;
  }
  
  let Nsfw;
  let Limit;
  
  if (channel.type !== "GUILD_VOICE") {
    Nsfw = channel.nsfw ? "Yes" : "No";
  } else {
    Limit = channel.userLimit > 0 ? channel.userLimit : "Unlimited";
  }
  
  
  let Embed = new MessageEmbed()
  .setColor(db.get(`channelDeleted_${channel.guild.id}.color`))
    .setTitle(`Channel Deleted!`)
    .addField(`Name:`, channel.name, true)
    .addField(`Type:`, Typed.toString(), true)
    .addField(`ID:`, channel.id.toString(), true)
    .addField(`Category:`, channel.parent.toString(), true)
    .addField(
      `${channel.type !== "GUILD_VOICE" ? "Nsfw" : "Users Limit"}:`,
      `${channel.type !== "GUILD_VOICE" ? Nsfw : Limit}`
    , true)
    .addField("Created:", `${prettyMilliseconds(Date.now() - channel.createdTimestamp, {verbose: true})} ago`, true)
    .setTimestamp();
    if(channel.type !== "GUILD_VOICE"){
      Embed.addField("Topic:", channel.topic || "No Topic!", true)
    }
  
  Channel.send({ embeds: [Embed]});
});


bot.on("roleCreate", async role => {
  if(db.get(`roleCreated_${role.guild.id}.enabled`) === "false") return;
  if(!db.get(`roleCreated_${role.guild.id}.channel`)) return;
  let channel = bot.channels.cache.get(db.get(`roleCreated_${role.guild.id}.channel`))
  if(!channel) return;

  let Embed = new MessageEmbed()
    .setColor(db.get(`roleCreated_${role.guild.id}.color`))
    .setTitle(`Role Created!`)
    .addField(`Name:`, role.name.toString(), true)
    .addField(`ID:`, role.id.toString(), true)
    .setTimestamp();

  channel.send({ embeds: [Embed]}) 
});

bot.on("roleDelete",  async role => {
  if(db.get(`roleDeleted_${role.guild.id}.enabled`) === "false") return;
  if(!db.get(`roleDeleted_${role.guild.id}.channel`)) return;
  let channel = bot.channels.cache.get(db.get(`roleDeleted_${role.guild.id}.channel`))
  if(!channel) return;

  let Embed = new MessageEmbed()
    .setColor(db.get(`roleDeleted_${role.guild.id}.color`))
    .setTitle(`Role Deleted!`)
    .addField(`Name:`, role.name.toString(), true)
    .addField(`ID:`, role.id.toString(), true)
    .addField(`color:`, role.hexColor.toString(), true)
    .addField("Created:", `${prettyMilliseconds(Date.now() - role.createdTimestamp, {verbose: true})} ago`)
    .setTimestamp();

  channel.send({ embeds: [Embed]}) 
});
  
  
bot.on("messageCreate", async message => {
  try {
    const hasText = Boolean(message.content);
    const hasImage = message.attachments.size !== 0;
    const hasEmbed = message.embeds.length !== 0;
    if (message.author.bot || (!hasText && !hasImage && !hasEmbed)) return;
    const origin = bot.phone.find(
      call => call.origin.id === message.channel.id
    );
    const recipient = bot.phone.find(
      call => call.recipient.id === message.channel.id
    );
    if (!origin && !recipient) return;
    const call = origin || recipient;
    if (!call.active) return;
    await call.send(
      origin ? call.recipient : call.origin,
      message,
      hasText,
      hasImage,
      hasEmbed
    );
  } catch {
    return;
  }
});

bot.on("guildMemberAdd", async member => {
  let wChan = db.fetch(`welcome_${member.guild.id}`);
  if (wChan === null) return;
  if (!wChan) return;

  let embed = new MessageEmbed()
    .setTitle("New Member Has Arrived")
    .setColor("RANDOM")
    .setDescription(
      `** <a:welcome:776470963369148421> Welcome ${member.user.username} to our ${member.guild.name} \n   <a:nikod:776472337834180610> ** | **You are member , ${member.guild.memberCount} in this server**`
    )
    .setImage("https://cdn.discordapp.com/attachments/788747001407471616/840192798027153438/5e78affab2547d678e4c5458dd931381.gif");

  let findChannel = member.guild.channels.cache.find(chan => chan.id === wChan);
  if (!findChannel) return;
  findChannel.send({ embeds: [embed]});
});


function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
  seconds = Math.floor((duration / 1000) % 60),
  minutes = Math.floor((duration / (1000 * 60)) % 60),
  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  
  if(hours === "00" && minutes === "00" && seconds === "00") return `0s`;
  else if(hours === "00" && minutes === "00") return `${seconds}s`;
  else if(hours === "00") return `${minutes}m ${seconds}s`;
  else return `${hours}h ${minutes}m ${seconds}s`;
  // return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

const used = new Map();

bot.on("messageCreate", async message => {
  if(!message.author.bot && message.guild && db.get(`customcommands_${message.guild.id}`) && db.get(`premium_${message.guild.id}`) && db.get(`customcommands_${message.guild.id}`).find(c => message.content.toLowerCase().startsWith(`${c.command}`))){
    db.get(`customcommands_${message.guild.id}`).find(c => {
      if(message.content.toLowerCase().startsWith(`${c.command}`)){
        let cooldown = used.get(`${c.id}_${ms(`${c.time.hours}h`) + ms(`${c.time.minutes}m`) + ms(`${c.time.seconds}s`)}_${message.guild.id}_${message.author.id}`);

        if(c.cooldown === "true" && cooldown) return message.channel.send(`Wait! your in cooldown, Please try again in ${msToTime(cooldown - Date.now())}`)

        if(db.get(`customcommands_${message.guild.id}_${c.id}`) === "false") return;
        const args = message.content.slice(c.command.length).split(" ");
        message.channel.send(c.message
          .replace(/{user.mention}/g, message.author)
          .replace(/{user.username}/g, message.author.username)
          .replace(/{channel.name}/g, message.channel.name)
          .replace(/{channel.topic}/g, message.channel.topic)
          .replace(/{guild.name}/g, message.guild.name)
          .replace(/{guild.id}/g, message.guild.id)
          .replace(/{user.id}/g, message.author.id)
          .replace(/{user.voiceChannel}/g, message.member.voice.channel)
          .replace(/{helpme.reason}/g, args.slice(1).join(" ") || "No reason given")
          .replace(/{helpme.voiceChannel}/g, message.member.voice.channel ? message.member.voice.channel.name : "No in voice channel")
          .replace(/{args1}/g, args[1] || "NaN")
          .replace(/{args2}/g, args[2] || "NaN")
          .replace(/{args3}/g, args[3] || "NaN")
          .replace(/{args4}/g, args[4] || "NaN")
          .replace(/{args5}/g, args[5] || "NaN"))

          used.set(`${c.id}_${ms(`${c.time.hours}h`) + ms(`${c.time.minutes}m`) + ms(`${c.time.seconds}s`)}_${message.guild.id}_${message.author.id}`, Date.now() + ms(`${c.time.hours}h`) + ms(`${c.time.minutes}m`) + ms(`${c.time.seconds}s`))

          setTimeout(() => {
            used.delete(`${c.id}_${ms(`${c.time.hours}h`) + ms(`${c.time.minutes}m`) + ms(`${c.time.seconds}s`)}_${message.guild.id}_${message.author.id}`);
          }, ms(`${c.time.hours}h`) + ms(`${c.time.minutes}m`) + ms(`${c.time.seconds}s`))
      }
    })
  }
  if(!message.author.bot && message.guild && db.get(`verificationEnabled_${message.guild.id}`) && db.get(`verificationOption_${message.guild.id}`) === "1" && db.get(`verificationChannel_${message.guild.id}`) === message.channel.id  && message.content.toLowerCase() === `${(db.get(`prefix_${message.guild.id}`) || "!")}verify`){
    let role =  message.guild.roles.cache.get(db.get(`verificationRole_${message.guild.id}`));
    if(!role) return;
    if (role.managed) return message.channel.send("**Cannot Add That Role To The User!**").then(m => setTimeout(() => m.delete(), 2000));
    if (message.guild.me.roles.highest.comparePositionTo(role) <= 0) return message.channel.send('**Role Is Currently Higher Than Me Therefore Cannot Add It To The User!**').then(m => setTimeout(() => m.delete(), 2000));
    if (message.member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send('**Cannot Add Role To This User! - [Higher Than Me In Role Hierachy]**').then(m => setTimeout(() => m.delete(), 2000));         
    
    try {
      if (message.member.roles.cache.has(role.id)) {
        message.delete();
        return;
      }
      await message.react('✅');
      message.member.roles.add(role.id);
      setTimeout(() => message.delete(), 5000)
    } catch {
      return;
    };
  }
})

bot.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if(interaction.customId === "verify"){
    if(interaction.member.bot) return;
    if(!interaction.guild) return;
    if(!db.get(`verificationEnabled_${interaction.guild.id}`)) return;
    if(db.get(`verificationOption_${interaction.guild.id}`) !== "2") return;
    if(db.get(`verificationChannel_${interaction.guild.id}`) !== interaction.channel.id) return;
    let role =  interaction.guild.roles.cache.get(db.get(`verificationRole_${interaction.guild.id}`));
    if(!role) return;

    if(!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply({ content: "**Cannot Add That Role To You! [Missing pPermissions]**", ephemeral: true });
    if(role.managed) return interaction.reply({ content: "**Cannot Add That Role To The User!**", ephemeral: true });
    if(interaction.guild.me.roles.highest.position < role.position) return interaction.reply({ content: '**Role Is Currently Higher Than Me Therefore Cannot Add It To The User!**', ephemeral: true });
    if(interaction.member.roles.highest.position >= interaction.guild.me.roles.highest.position) return interaction.reply({ content: '**Cannot Add Role To This User! - [Higher Than Me In Role Hierachy]**', ephemeral: true });   
    
    try {
      if(interaction.member.roles.cache.has(role.id)) return interaction.deferUpdate();
      
      interaction.member.roles.add(role.id);
      interaction.reply({content: "Successfully verified", ephemeral: true });
    } catch {
      interaction.deferUpdate();
    };
  }
});

bot.login(config.token);

bot.on("ready", async () => {
  const web = require("./server");
  web.load(bot);
});

module.exports = bot;