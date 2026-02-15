import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Muestra información detallada de un usuario.")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario a inspeccionar")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const roles = member.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .map(r => r.toString())
      .join(", ") || "Sin roles";

    const boostStatus = member.premiumSince
      ? `Sí, desde <t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`
      : "No";

    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name: `Información de ${user.tag}`,
        iconURL: user.displayAvatarURL({ size: 1024 })
      })
      .setThumbnail(user.displayAvatarURL({ size: 1024 }))
      .addFields(
        {
          name: "🆔 ID",
          value: user.id,
          inline: true
        },
        {
          name: "🤖 ¿Bot?",
          value: user.bot ? "Sí" : "No",
          inline: true
        },
        {
          name: "🚀 Boosting",
          value: boostStatus,
          inline: true
        },
        {
          name: "📅 Cuenta creada",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>\n<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
          inline: false
        },
        {
          name: "📥 Se unió al servidor",
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>\n<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
          inline: false
        },
        {
          name: `🎭 Roles (${member.roles.cache.size - 1})`,
          value: roles,
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
