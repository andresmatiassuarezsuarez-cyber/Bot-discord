import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Silencia a un usuario.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario a mutear")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("minutos")
        .setDescription("Duración del mute")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const minutes = interaction.options.getInteger("minutos");

    const member = await interaction.guild.members.fetch(user.id);

    await member.timeout(minutes * 60 * 1000, "Mute aplicado");

    interaction.reply(`🔇 **${user.tag}** ha sido muteado por **${minutes} minutos**.`);

    const logChannel = interaction.guild.channels.cache.find(c => c.name === "logs");
    if (logChannel) {
      logChannel.send(`🔇 **Mute aplicado**
👤 Usuario: ${user.tag}
⏳ Duración: ${minutes} minutos
🛠 Staff: ${interaction.user.tag}`);
    }
  }
};

