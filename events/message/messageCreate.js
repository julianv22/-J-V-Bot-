const { Collection } = require("discord.js");

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    try {
      const content = message.content;

      if (message.channel.type === 'DM') return;
      if (message.author.bot) return;

      if (!content.startsWith(cfg.prefix)) {
        const hint = `\`\`\`💡 | Hint: sử dụng ${cfg.prefix}thanks | ${cfg.prefix}ty để cảm ơn người khác\`\`\``;
        const thanks = ["cảm ơn", "thank", "ty"];
        thanks.forEach((thank) => {
          if (content.toLowerCase().includes(thank)) return message.reply(hint);
        });
        return;
      };

      if (content.startsWith(cfg.prefix)) {
        // Check Bot Permissions 
        const botPermission = "SEND_MESSAGES" && "MANAGE_MESSAGES" && "EMBED_LINKS" && "ADD_REACTIONS";

        if (!message.channel.permissionsFor(cfg.botID).toArray().includes(botPermission))
          return console.log("\n\n-----------Bot CANT send message!!-----------\n\n");

        const args = content.slice(cfg.prefix.length).split(/ +/);
        const cmdName = args.shift().toLowerCase();
        const command =
          client.commands.get(cmdName) ||
          client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

        if (!command) return message.reply(`\`\`\`❌ | Command [${cmdName}] không chính xác hoặc không tồn tại!\`\`\``);

        // Start Command Cooldown
        if (!client.cooldowns.has(command.name))
          client.cooldowns.set(command.name, new Collection());

        const now = Date.now();
        const timeStamp = client.cooldowns.get(command.name);
        const amount = (command.cooldown || 3) * 1000;

        if (timeStamp.has(message.author.id)) {
          const exprTime = timeStamp.get(message.author.id) + amount;
          if (now < exprTime) {
            const timeLeft = (exprTime - now) / 1000;
            return message.reply(
              `\`\`\`❌ | Tôi mệt rồi! Vui lòng chờ ${timeLeft.toFixed(1)}s để sử dụng tiếp command [${command.name}]\`\`\``
            );
          };
        };

        timeStamp.set(message.author.id, now);
        setTimeout(() => timeStamp.delete(message.author.id), amount);
        // End Command Colldown

        await command.execute(message, args, client);
      };
    } catch (error) {
      console.error(chalk.red("messageCreate"), error);
    };
  }
}