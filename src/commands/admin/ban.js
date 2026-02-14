import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un usuario.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario a banear')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) return interaction.reply('No encontré al usuario.');

    await member.ban({ reason: 'Baneado por comando /ban' });
    await interaction.reply(`🔨 Usuario **${user.tag}** baneado.`);
  }
};
