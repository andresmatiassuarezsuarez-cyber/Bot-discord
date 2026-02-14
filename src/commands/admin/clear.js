import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Borra mensajes del chat.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
      option.setName("cantidad")
        .setDescription("Cantidad de mensajes a borrar")
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("cantidad");

    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: "❌ Debes elegir entre 1 y 100 mensajes.", ephemeral: true });
    }

    await interaction.channel.bulkDelete(amount, true);

    interaction.reply(`🧹 Se borraron **${amount}** mensajes.`);
  }
};
