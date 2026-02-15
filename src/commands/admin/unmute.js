import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Quita el mute a un usuario.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario a desmutear")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const member = await interaction.guild.members.fetch(user.id);

    await member.timeout(null);

    interaction.reply(`🔊 **${user.tag}** ha sido desmuteado.`);
  }
};
