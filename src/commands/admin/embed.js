import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Crea un embed personalizado'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setDescription('Usa los botones para personalizar tu embed.');

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('set_author').setLabel('Set Author').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('set_title').setLabel('Set Title').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('set_description').setLabel('Set Description').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('set_color').setLabel('Set Color').setStyle(ButtonStyle.Primary)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('set_image').setLabel('Set Image').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('set_thumbnail').setLabel('Set Thumbnail').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('set_footer').setLabel('Set Footer').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('add_field').setLabel('Add Field').setStyle(ButtonStyle.Primary)
    );

    const row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('cancel_embed').setLabel('Cancel').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('send_embed').setLabel('Send Embed').setStyle(ButtonStyle.Success)
    );

    interaction.client.embedSessions ??= {};
    interaction.client.embedSessions[interaction.user.id] = {
      embed,
      channel: interaction.channel
    };

    await interaction.reply({
      content: 'Personaliza tu embed:',
      embeds: [embed],
      components: [row1, row2, row3],
      ephemeral: true
    });
  }
};
