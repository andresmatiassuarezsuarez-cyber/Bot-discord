import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Muestra información del servidor."),

  async execute(interaction) {
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setTitle(`Información de ${guild.name}`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "ID", value: guild.id },
        { name: "Miembros", value: `${guild.memberCount}` },
        { name: "Creado", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>` }
      );

    interaction.reply({ embeds: [embed] });
  }
};
