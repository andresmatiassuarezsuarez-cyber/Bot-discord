import { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Bloquea un canal para que los miembros no puedan escribir.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false
    });

    interaction.reply(`🔒 El canal ${channel} ha sido bloqueado.`);
  }
};
