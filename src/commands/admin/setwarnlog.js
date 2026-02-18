import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("setwarnlog")
    .setDescription("Selecciona el canal donde se enviarán los logs de warns.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option
        .setName("canal")
        .setDescription("Canal donde se enviarán los logs")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("canal");

    const filePath = path.resolve("src/data/warnConfig.json");
    const config = JSON.parse(fs.readFileSync(filePath, "utf8"));

    config.logChannel = channel.id;

    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

    const embed = new EmbedBuilder()
      .setColor("#00ff99")
      .setTitle("📌 Canal de Warn Logs Configurado")
      .setDescription(
        `Los warns ahora se enviarán en el canal:\n\n` +
        `➡️ ${channel}`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
