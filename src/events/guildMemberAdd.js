import { EmbedBuilder } from 'discord.js';

export default {
  name: 'guildMemberAdd',
  async execute(member) {
    const canal = member.guild.systemChannel;
    if (!canal) return;

    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('👋 ¡Nuevo miembro!')
      .setDescription(`Bienvenido **${member.user.username}** a **${member.guild.name}**`)
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp();

    canal.send({ embeds: [embed] });
  }
};
