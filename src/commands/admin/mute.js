import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Silencia temporalmente a un usuario.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    // ✅ PRIMERO LAS OPCIONES OBLIGATORIAS
    .addIntegerOption(option =>
      option
        .setName("tiempo")
        .setDescription("Duración del mute en minutos")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón del mute")
        .setRequired(true)
    )
    // ✅ LUEGO LAS OPCIONALES
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Selecciona al usuario a mutear")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("id")
        .setDescription("ID del usuario a mutear")
        .setRequired(false)
    ),

  async execute(interaction) {
    const userOption = interaction.options.getUser("usuario");
    const idOption = interaction.options.getString("id");
    const minutes = interaction.options.getInteger("tiempo");
    const reason = interaction.options.getString("razon");

    if (!userOption && !idOption) {
      return interaction.reply({
        content: "⚠️ Debes seleccionar un usuario o escribir una ID.",
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

    if (!member || !member.moderatable) {
      return interaction.reply({
        content: "❌ No puedo mutear a ese usuario.",
        ephemeral: true
      });
    }

    const durationMs = minutes * 60 * 1000;

    const filePath = path.resolve("src/data/mutes.json");
    const db = JSON.parse(fs.readFileSync(filePath, "utf8"));

    db[user.id] = {
      user: user.id,
      moderator: interaction.user.id,
      reason,
      date: Date.now(),
      duration: durationMs
    };

    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));

    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setTitle("🔇 Usuario Muteado")
      .addFields(
        { name: "👤 Usuario", value: `${user.tag} (${user.id})` },
        { name: "📝 Razón", value: reason },
        { name: "⏳ Duración", value: `${minutes} minutos` },
        { name: "👮 Moderador", value: interaction.user.tag }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
