import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("mutelist")
    .setDescription("Muestra la lista de usuarios muteados con detalles.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    await interaction.deferReply();

    const filePath = path.resolve("src/data/mutes.json");
    const db = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const entries = Object.values(db);

    if (entries.length === 0) {
      return interaction.editReply("🔊 No hay usuarios muteados actualmente.");
    }

    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setTitle("🔇 Lista de usuarios muteados")
      .setTimestamp();

    for (const entry of entries) {
      const end = entry.date + entry.duration;

      embed.addFields({
        name: `👤 Usuario ID: ${entry.user}`,
        value:
          `**Moderador:** <@${entry.moderator}>\n` +
          `**Razón:** ${entry.reason}\n` +
          `**Muteado:** <t:${Math.floor(entry.date / 1000)}:f>\n` +
          `**Termina:** <t:${Math.floor(end / 1000)}:R>\n`,
        inline: false
      });
    }

    await interaction.editReply({ embeds: [embed] });
  }
};
