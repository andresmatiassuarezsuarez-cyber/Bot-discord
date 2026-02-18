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
    .setName("setserverstatuschannel")
    .setDescription("Selecciona el canal donde se enviarán los avisos del servidor.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option
        .setName("canal")
        .setDescription("Canal para los avisos")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("canal");

    const filePath = path.resolve("src/data/serverConfig.json");
    const config = JSON.parse(fs.readFileSync(filePath, "utf8"));

    config.statusChannel = channel.id;

    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));

    const embed = new EmbedBuilder()
      .setColor("#00ff99")
      .setTitle("📡 Canal de Estado Configurado")
      .setDescription(`Los avisos del servidor se enviarán en:\n➡️ ${channel}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
