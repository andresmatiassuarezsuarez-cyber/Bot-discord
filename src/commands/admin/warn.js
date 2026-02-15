import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Advierte a un usuario.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario a advertir")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("razon")
        .setDescription("Razón de la advertencia")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("razon") || "Sin razón especificada";

    interaction.reply(`⚠️ **${user.tag}** ha sido advertido.\n📝 Razón: **${reason}**`);
  }
};
