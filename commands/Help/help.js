const { MessageEmbed } = require("discord.js");
const fs = require('fs');

exports.name = "help";
exports.aliases = ["h"];
exports.category = "help";
exports.description = "⤷\`Đọc kỹ hướng dẫn SD trước khi dùng!\`";
exports.ussage = `Sử dụng \`${cfg.prefix}${exports.name}\` để xem danh sách các command.\n
\`${cfg.prefix}[tên command] ?\` để xem hướng dẫn chi tiết của command đó.\n
${exports.description}`;

exports.execute = async (message, args, client) => {
  if (args.join(' ').trim() === '?')
    return client.cmdGuide(message, exports.name, exports.ussage);

  const user = message.author;
  let cmds = [];
  const cmdCategories = await client.commands.map(cmd => cmd.category)
  const catFilter = await cmdCategories.filter((item, index) => cmdCategories.indexOf(item) === index)

  for (const cat of catFilter) {
    const cmd = await client.commands.map(cmd => cmd).filter(cmd => cmd.category === cat);
    cmds.push({
      name: `${cfg.folder} ${cat.toUpperCase()} [${cmd.length}]`,
      value: `\`\`\`${cmd.map(cmd => cmd.name).join(' | ')}\`\`\``
    })
  };

  const embed = new MessageEmbed()
    .setAuthor(`Xin chào ${user.username}!`, user.displayAvatarURL(true))
    .setTitle('Dưới đây là một số command bạn có thể sử dụng')
    .setDescription(`Nếu bạn cần hỗ trợ, hãy tham gia máy chủ hỗ trợ: [\`🦸〔J-V Bot〕 SUPPORT\`](https://discord.gg/dyd8DXbrVq)`)
    .setColor("RANDOM")
    .setThumbnail(cfg.helpPNG)
    .addField(`Tổng số command: [${client.commands.size}]`, `\u200b\nCommand prefix: \`${cfg.prefix}\``)
    .addFields(cmds)
    .addField(`\u200b`, `\`${cfg.prefix}[tên command] ?\` để xem hướng dẫn chi tiết của command`)
    .setFooter(message.guild.name, message.guild.iconURL(true))
    .setTimestamp()
  message.delete().then(() => message.channel.send({ embeds: [embed] }));
}