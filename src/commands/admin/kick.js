import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa a un usuario del servidor.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)

    // ✅ PRIMERO LA OPCIÓN OBLIGATORIA
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón del kick")
        .setRequired(true)
    )

    // ✅ LUEGO LAS OPCIONALES
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Selecciona al usuario a expulsar")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("id")
        .setDescription("ID del usuario a expulsar (si no lo seleccionas arriba)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const userOption = interaction.options.getUser("usuario");
    const idOption = interaction.options.getString("id");
    const reason = interaction.options.getString("razon");

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

    if (!member.kickable) {
      return interaction.reply({
        content: "❌ No puedo expulsar a ese usuario.",
        ephemeral: true
      });
    }

    let invite;
    try {
      invite = await interaction.channel.createInvite({
        maxAge: 0,
        maxUses: 1,
        reason: "Invitación generada para usuario expulsado"
      });
    } catch {
      invite = null;
    }

    const dmEmbed = new EmbedBuilder()
      .setColor("#ff9900")
      .setTitle("⚠️ Has sido expulsado del servidor")
      .setDescription(
        `Fuiste expulsado de **${interaction.guild.name}**.\n\n` +
        `**Motivo:** ${reason}\n\n` +
        "Si deseas volver a unirte, aquí tienes una invitación:\n" +
        (invite ? `🔗 ${invite.url}` : "❌ No se pudo generar una invitación.") +
        "\n\nSi crees que esto fue un error, contacta con los administradores."
      )
      .setThumbnail(interaction.guild.iconURL({ size: 1024 }))
      .setTimestamp();

    await user.send({ embeds: [dmEmbed] }).catch(() => {});

    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setColor("#ff9900")
      .setTitle("⚠️ Usuario Expulsado")
      .setThumbnail(user.displayAvatarURL({ size: 1024 }))
      .addFields(
        { name: "👤 Usuario", value: `${user.tag} (${user.id})` },
        { name: "📝 Razón", value: reason },
        { name: "👮 Moderador", value: interaction.user.tag }
      )
      .setFooter({ text: "Acción de moderación ejecutada" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};

