import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import fs from "fs";

export default {
  data: new SlashCommandBuilder()
    .setName("setlog")
    .setDescription("Configura el canal donde se enviarán los logs.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option.setName("canal")
        .setDescription("Canal donde se enviarán los logs")
        .setRequired(true)
    ),

  async execute(interaction) {
    const canal = interaction.options.getChannel("canal");

    const config = {
      logChannel: canal.id
    };

    fs.writeFileSync("./logConfig.json", JSON.stringify(config, null, 2));

    interaction.reply(`📘 Canal de logs configurado en: ${canal}`);
  }
};
