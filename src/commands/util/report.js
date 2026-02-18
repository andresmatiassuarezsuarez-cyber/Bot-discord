import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Reporta a un usuario al staff.")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario que quieres reportar")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón del reporte")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("razon");

    const filePath = path.resolve("src/data/serverConfig.json");
    const config = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!config.reportChannel) {
      return interaction.reply({
        content: "⚠️ No hay canal de reportes configurado. Usa `/setreportchannel`.",
        ephemeral: true
      });
    }

    const channel = interaction.guild.channels.cache.get(config.reportChannel);

    const embed = new EmbedBuilder()
      .setColor("#ff4444")
      .setTitle("🚨 Nuevo Reporte")
      .addFields(
        { name: "👤 Reportado", value: `${user.tag} (${user.id})` },
        { name: "📝 Razón", value: reason },
        { name: "📨 Reportado por", value: `${interaction.user.tag}` }
      )
      .setTimestamp();

    channel.send({ embeds: [embed] });

    await interaction.reply({
      content: "📩 Tu reporte ha sido enviado al staff.",
      ephemeral: true
    });
  }
};
