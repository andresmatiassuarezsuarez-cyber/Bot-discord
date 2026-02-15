import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Muestra información detallada del servidor."),

  async execute(interaction) {
    const { guild } = interaction;

    const owner = await guild.fetchOwner();
    const roles = guild.roles.cache.size;
    const channels = guild.channels.cache.size;
    const emojis = guild.emojis.cache.size;
    const boosts = guild.premiumSubscriptionCount;
    const boostLevel = guild.premiumTier;

    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name: `Información del servidor`,
        iconURL: guild.iconURL({ size: 1024 })
      })
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .addFields(
        {
          name: "📛 Nombre",
          value: guild.name,
          inline: true
        },
        {
          name: "🆔 ID",
          value: guild.id,
          inline: true
        },
        {
          name: "👑 Dueño",
          value: `${owner.user.tag} (${owner.id})`,
          inline: false
        },
        {
          name: "👥 Miembros",
          value: `${guild.memberCount}`,
          inline: true
        },
        {
          name: "📂 Canales",
          value: `${channels}`,
          inline: true
        },
        {
          name: "🎭 Roles",
          value: `${roles}`,
          inline: true
        },
        {
          name: "😄 Emojis",
          value: `${emojis}`,
          inline: true
        },
        {
          name: "🚀 Boosts",
          value: `${boosts} (Nivel ${boostLevel})`,
          inline: true
        },
        {
          name: "📅 Creado",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>\n<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
          inline: false
        }
      )
      .setFooter({
        text: `Solicitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
