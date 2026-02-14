import {
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Muestra información detallada del servidor'),

  async execute(interaction) {
    const guild = interaction.guild;

    const owner = await guild.fetchOwner();

    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const categories = guild.channels.cache.filter(c => c.type === 4).size;

    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle(`${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .addFields(
        {
          name: '📌 Información del Servidor',
          value:
            `**ID:** ${guild.id}\n` +
            `**Propietario:** ${owner}\n` +
            `**Creado:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R> (<t:${Math.floor(guild.createdTimestamp / 1000)}:f>)`
        },
        {
          name: '👥 Miembros',
          value: `**${guild.memberCount}** miembros`,
          inline: true
        },
        {
          name: '🚀 Impulsos',
          value:
            `**Nivel:** ${guild.premiumTier}\n` +
            `**Impulsos:** ${guild.premiumSubscriptionCount}`,
          inline: true
        },
        {
          name: '📂 Roles',
          value: `${guild.roles.cache.size} roles`,
          inline: true
        },
        {
          name: '📺 Canales',
          value:
            `**Texto:** ${textChannels}\n` +
            `**Voz:** ${voiceChannels}\n` +
            `**Categorías:** ${categories}`,
          inline: true
        },
        {
          name: '😄 Emojis',
          value: `${guild.emojis.cache.size}/${guild.emojiLimit} emojis`,
          inline: true
        }
      )
      .setFooter({ text: `Solicitado por ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: false
    });
  }
};
