import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("warnlist")
    .setDescription("Muestra la lista de usuarios con warns y cuántos tienen.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    await interaction.deferReply();

    const warnsPath = path.resolve("src/data/warns.json");

    // Crear archivo si no existe
    if (!fs.existsSync(warnsPath)) fs.writeFileSync(warnsPath, "{}");

    const warnsDB = JSON.parse(fs.readFileSync(warnsPath, "utf8"));
    const entries = Object.entries(warnsDB);

    if (entries.length === 0) {
      return interaction.editReply("📭 No hay usuarios con warns actualmente.");
    }

    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setTitle("📋 Lista de usuarios con warns")
      .setDescription("Aquí tienes un resumen de todos los warns registrados:")
      .setTimestamp();

    for (const [userId, warns] of entries) {
      embed.addFields({
        name: `👤 Usuario: <@${userId}>`,
        value: `**Warns:** ${warns.length}`,
        inline: false
      });
    }

    await interaction.editReply({ embeds: [embed] });
  }
};
