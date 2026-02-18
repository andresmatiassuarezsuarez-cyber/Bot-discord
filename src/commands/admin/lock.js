import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Bloquea el canal actual para que los usuarios no puedan escribir.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón del bloqueo del canal")
        .setRequired(false)
    ),

  async execute(interaction) {
    const channel = interaction.channel;
    const reason = interaction.options.getString("razon") || "No especificada";

    // Bloquear canal
    await channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      { SendMessages: false },
      { reason }
    );

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("🔒 Canal Bloqueado")
      .setDescription(
        `Este canal ha sido bloqueado.\n\n` +
        `**Razón:** ${reason}`
      )
      .addFields(
        { name: "👮 Moderador", value: interaction.user.tag }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
