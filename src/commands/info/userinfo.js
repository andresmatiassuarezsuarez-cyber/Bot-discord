import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Muestra información de un usuario.")
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario a inspeccionar")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setTitle(`Información de ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "ID", value: user.id },
        { name: "Cuenta creada", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>` },
        { name: "Se unió", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` }
      );

    interaction.reply({ embeds: [embed] });
  }
};
