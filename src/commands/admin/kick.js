import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa a un usuario del servidor.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario a expulsar")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("razon")
        .setDescription("Razón del kick")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("razon") || "Sin razón especificada";

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: "❌ No puedo encontrar a ese usuario.", ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: "❌ No puedo expulsar a ese usuario.", ephemeral: true });
    }

    await member.kick(reason);

    interaction.reply({
      content: `✅ **${user.tag}** fue expulsado.\n📝 Razón: **${reason}**`
    });

    const logChannel = interaction.guild.channels.cache.find(c => c.name === "logs");
    if (logChannel) {
      logChannel.send(`🔨 **Kick ejecutado**
👤 Usuario: ${user.tag}
🛠 Staff: ${interaction.user.tag}
📝 Razón: ${reason}`);
    }
  }
};
