const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./index.js', { token: 'Nzk2OTg4MzA3NDYwNDU2NTA4.X_f7Mw.HrZ86XUy2L8tNYXMy0dFa0n125I '});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();