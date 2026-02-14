import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario del servidor.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario a banear")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("razon")
        .setDescription("Razón del ban")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("razon") || "Sin razón especificada";

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: "❌ No puedo encontrar a ese usuario.", ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: "❌ No puedo banear a ese usuario.", ephemeral: true });
    }

    await member.ban({ reason });

    interaction.reply(`⛔ **${user.tag}** fue baneado.\n📝 Razón: **${reason}**`);

    const logChannel = interaction.guild.channels.cache.find(c => c.name === "logs");
    if (logChannel) {
      logChannel.send(`⛔ **Ban ejecutado**
👤 Usuario: ${user.tag}
🛠 Staff: ${interaction.user.tag}
📝 Razón: ${reason}`);
    }
  }
};
