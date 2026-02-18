import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Envía una sugerencia al servidor.")
    .addStringOption(option =>
      option
        .setName("sugerencia")
        .setDescription("Tu sugerencia")
        .setRequired(true)
    ),

  async execute(interaction) {
    const suggestion = interaction.options.getString("sugerencia");

    const filePath = path.resolve("src/data/serverConfig.json");
    const config = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!config.suggestChannel) {
      return interaction.reply({
        content: "⚠️ No hay canal de sugerencias configurado. Usa `/setsuggestchannel`.",
        ephemeral: true
      });
    }

    const channel = interaction.guild.channels.cache.get(config.suggestChannel);

    const embed = new EmbedBuilder()
      .setColor("#00aaff")
      .setTitle("💡 Nueva Sugerencia")
      .setDescription(suggestion)
      .addFields({ name: "📨 Enviada por", value: interaction.user.tag })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("suggest_up")
        .setLabel("👍")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("suggest_down")
        .setLabel("👎")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({ embeds: [embed], components: [row] });

    await interaction.reply({
      content: "📬 Tu sugerencia ha sido enviada.",
      ephemeral: true
    });
  }
};
