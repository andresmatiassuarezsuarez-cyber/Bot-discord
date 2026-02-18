import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("serveropen")
    .setDescription("Anuncia que el servidor está abierto.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const filePath = path.resolve("src/data/serverConfig.json");
    const config = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!config.statusChannel) {
      return interaction.reply({
        content: "⚠️ No hay canal configurado. Usa `/setserverstatuschannel`.",
        ephemeral: true
      });
    }

    const channel = interaction.guild.channels.cache.get(config.statusChannel);

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle("🟢 Servidor Abierto")
      .setDescription("El servidor está **abierto**. ¡Puedes unirte ahora!")
      .setTimestamp();

    channel.send({ embeds: [embed] });

    await interaction.reply({
      content: "Mensaje enviado.",
      ephemeral: true
    });
  }
};
