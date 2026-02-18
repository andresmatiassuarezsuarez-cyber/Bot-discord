import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("warninfo")
    .setDescription("Muestra todos los warns detallados de un usuario.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario del que quieres ver los warns")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");

    const warnsPath = path.resolve("src/data/warns.json");

    // Crear archivo si no existe
    if (!fs.existsSync(warnsPath)) fs.writeFileSync(warnsPath, "{}");

    const warnsDB = JSON.parse(fs.readFileSync(warnsPath, "utf8"));

    if (!warnsDB[user.id] || warnsDB[user.id].length === 0) {
      return interaction.reply({
        content: "📭 Ese usuario **no tiene warns registrados**.",
        ephemeral: true
      });
    }

    const warns = warnsDB[user.id];

    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setTitle(`📋 Warns de ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ size: 1024 }))
      .setDescription(`Este usuario tiene **${warns.length} warn(s)**.`)
      .setTimestamp();

    warns.forEach((warn, index) => {
      embed.addFields({
        name: `⚠️ Warn #${index + 1}`,
        value:
          `**Moderador:** <@${warn.moderator}>\n` +
          `**Razón:** ${warn.reason}\n` +
          `**Fecha:** <t:${Math.floor(warn.date / 1000)}:f>\n`,
        inline: false
      });
    });

    await interaction.reply({ embeds: [embed] });
  }
};
