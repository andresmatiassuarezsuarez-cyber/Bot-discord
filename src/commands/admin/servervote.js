import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("servervote")
    .setDescription("Inicia una votación para abrir el servidor.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addIntegerOption(option =>
      option
        .setName("meta")
        .setDescription("Número de votos necesarios para abrir el servidor.")
        .setRequired(true)
    ),

  async execute(interaction) {
    const goal = interaction.options.getInteger("meta");

    const filePath = path.resolve("src/data/serverConfig.json");
    const config = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!config.statusChannel) {
      return interaction.reply({
        content: "⚠️ No hay canal configurado. Usa `/setserverstatuschannel`.",
        ephemeral: true
      });
    }

    let votes = 0;

    const embed = new EmbedBuilder()
      .setColor("#ffaa00")
      .setTitle("🗳️ Votación para Abrir el Servidor")
      .setDescription(
        `Pulsa el botón para votar.\n\n` +
        `📌 Meta: **${goal} votos**\n` +
        `🧮 Votos actuales: **0**`
      )
      .setTimestamp();

    const voteButton = new ButtonBuilder()
      .setCustomId("vote_button")
      .setLabel("✔ Votar")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(voteButton);

    const msg = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true
    });

    const collector = msg.createMessageComponentCollector({
      componentType: 2,
      time: 600000 // 10 minutos
    });

    collector.on("collect", async (btn) => {
      if (btn.customId !== "vote_button") return;

      votes++;

      // Actualizar embed
      const updatedEmbed = EmbedBuilder.from(embed).setDescription(
        `Pulsa el botón para votar.\n\n` +
        `📌 Meta: **${goal} votos**\n` +
        `🧮 Votos actuales: **${votes}**`
      );

      await btn.update({ embeds: [updatedEmbed], components: [row] });

      // Si llega a la meta → abrir servidor
      if (votes >= goal) {
        collector.stop("goal_reached");

        const channel = interaction.guild.channels.cache.get(config.statusChannel);

        const openEmbed = new EmbedBuilder()
          .setColor("#00ff00")
          .setTitle("🟢 Servidor Abierto")
          .setDescription("La votación ha sido completada. ¡El servidor está **abierto**!")
          .setTimestamp();

        channel.send({ embeds: [openEmbed] });
      }
    });

    collector.on("end", (_, reason) => {
      if (reason !== "goal_reached") {
        msg.edit({
          components: [],
          embeds: [
            EmbedBuilder.from(embed)
              .setColor("#888888")
              .setTitle("⏳ Votación Finalizada")
              .setDescription(
                `La votación terminó.\n\n` +
                `📌 Meta: **${goal} votos**\n` +
                `🧮 Votos finales: **${votes}**`
              )
          ]
        });
      }
    });
  }
};
