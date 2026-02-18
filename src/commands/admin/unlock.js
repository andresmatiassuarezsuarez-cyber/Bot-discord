import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Desbloquea el canal actual para que los usuarios puedan escribir.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón del desbloqueo del canal")
        .setRequired(false)
    ),

  async execute(interaction) {
    const channel = interaction.channel;
    const reason = interaction.options.getString("razon") || "No especificada";

    // Desbloquear canal
    await channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      { SendMessages: true },
      { reason }
    );

    const embed = new EmbedBuilder()
      .setColor("#00ff99")
      .setTitle("🔓 Canal Desbloqueado")
      .setDescription(
        `Este canal ha sido desbloqueado.\n\n` +
        `**Razón:** ${reason}`
      )
      .addFields(
        { name: "👮 Moderador", value: interaction.user.tag }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
