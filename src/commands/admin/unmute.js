import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Quita el mute (timeout) a un usuario.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Selecciona al usuario a desmutear")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("id")
        .setDescription("ID del usuario a desmutear (si no lo seleccionas arriba)")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón del unmute")
        .setRequired(false)
    ),

  async execute(interaction) {
    const userOption = interaction.options.getUser("usuario");
    const idOption = interaction.options.getString("id");
    const reason = interaction.options.getString("razon") || "Sin especificar";

    if (!userOption && !idOption) {
      return interaction.reply({
        content: "⚠️ Debes seleccionar un usuario **o** escribir una **ID**.",
        ephemeral: true
      });
    }

    let user;
    try {
      user = userOption || await interaction.client.users.fetch(idOption);
    } catch {
      return interaction.reply({
        content: "❌ No pude encontrar a ese usuario.",
        ephemeral: true
      });
    }

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "❌ Ese usuario no está en el servidor.",
        ephemeral: true
      });
    }

    if (!member.isCommunicationDisabled()) {
      return interaction.reply({
        content: "⚠️ Ese usuario **no está muteado** actualmente.",
        ephemeral: true
      });
    }

    // Quitar el timeout
    await member.timeout(null, reason);

    // Embed DM
    const dmEmbed = new EmbedBuilder()
      .setColor("#00ff99")
      .setTitle("🔊 Has sido desmuteado")
      .setDescription(
        `Fuiste desmuteado en **${interaction.guild.name}**.\n\n` +
        `**Motivo:** ${reason}\n\n` +
        "Ya puedes volver a hablar en el servidor."
      )
      .setThumbnail(interaction.guild.iconURL({ size: 1024 }))
      .setTimestamp();

    await user.send({ embeds: [dmEmbed] }).catch(() => {});

    // Embed público
    const embed = new EmbedBuilder()
      .setColor("#00ff99")
      .setTitle("🔊 Usuario Desmuteado")
      .setThumbnail(user.displayAvatarURL({ size: 1024 }))
      .addFields(
        {
          name: "👤 Usuario",
          value: `${user.tag} (${user.id})`
        },
        {
          name: "📝 Razón",
          value: reason
        },
        {
          name: "👮 Moderador",
          value: interaction.user.tag
        }
      )
      .setFooter({ text: "Acción de moderación ejecutada" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
