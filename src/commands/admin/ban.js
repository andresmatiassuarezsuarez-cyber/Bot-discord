import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario del servidor.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Selecciona al usuario a banear")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("id")
        .setDescription("ID del usuario a banear (si no lo seleccionas arriba)")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón del ban")
        .setRequired(true)
    ),

  async execute(interaction) {
    const userOption = interaction.options.getUser("usuario");
    const idOption = interaction.options.getString("id");
    const reason = interaction.options.getString("razon");

    // Validación: debe elegir usuario o ID
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

    // Intentar obtener al miembro del servidor
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    // Verificar si se puede banear
    if (member && !member.bannable) {
      return interaction.reply({
        content: "❌ No puedo banear a ese usuario.",
        ephemeral: true
      });
    }

    // Intentar enviar mensaje privado al usuario
    const dmEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⛔ Has sido baneado de un servidor")
      .setDescription(
        `Fuiste baneado del servidor **${interaction.guild.name}**.\n\n` +
        `**Motivo:** ${reason}\n\n` +
        "Si deseas apelar el ban, contacta con los administradores."
      )
      .setThumbnail(interaction.guild.iconURL({ size: 1024 }))
      .setTimestamp();

    await user.send({ embeds: [dmEmbed] }).catch(() => {});

    // Banear al usuario
    await interaction.guild.members.ban(user.id, { reason });

    // Embed público
    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("🔨 Usuario Baneado")
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
