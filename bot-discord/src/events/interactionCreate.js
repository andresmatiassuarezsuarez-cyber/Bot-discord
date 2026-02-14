import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
} from 'discord.js';

export default {
  name: 'interactionCreate',

  async execute(interaction) {
    const sessions = interaction.client.embedSessions ??= {};

    // ============================
    // 1. MANEJO DE COMANDOS
    // ============================
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: 'Hubo un error ejecutando este comando.',
            ephemeral: true
          });
        }
      }
      return;
    }

    // ============================
    // 2. MANEJO DE BOTONES
    // ============================
    if (interaction.isButton()) {
      const session = sessions[interaction.user.id];
      if (!session)
        return interaction.reply({
          content: 'No tienes un embed activo.',
          ephemeral: true
        });

      const embed = session.embed;

      const modalMap = {
        set_author: 'Autor',
        set_title: 'Título',
        set_description: 'Descripción',
        set_color: 'Color',
        set_image: 'Imagen URL',
        set_thumbnail: 'Thumbnail URL',
        set_footer: 'Footer'
      };

      // ============================
      // MODALES PRE-RELLENADOS
      // ============================
      if (modalMap[interaction.customId]) {
        let currentValue = '';

        switch (interaction.customId) {
          case 'set_author':
            currentValue = embed.data.author?.name ?? '';
            break;
          case 'set_title':
            currentValue = embed.data.title ?? '';
            break;
          case 'set_description':
            currentValue = embed.data.description ?? '';
            break;
          case 'set_color':
            currentValue = embed.data.color
              ? `#${embed.data.color.toString(16)}`
              : '';
            break;
          case 'set_image':
            currentValue = embed.data.image?.url ?? '';
            break;
          case 'set_thumbnail':
            currentValue = embed.data.thumbnail?.url ?? '';
            break;
          case 'set_footer':
            currentValue = embed.data.footer?.text ?? '';
            break;
        }

        const modal = new ModalBuilder()
          .setCustomId(`modal_${interaction.customId}`)
          .setTitle(`Editar ${modalMap[interaction.customId]}`);

        const input = new TextInputBuilder()
          .setCustomId('value')
          .setLabel(`Nuevo valor para ${modalMap[interaction.customId]}`)
          .setStyle(TextInputStyle.Paragraph)
          .setValue(currentValue);

        modal.addComponents(new ActionRowBuilder().addComponents(input));
        return interaction.showModal(modal);
      }

      // ============================
      // ADD FIELD
      // ============================
      if (interaction.customId === 'add_field') {
        const modal = new ModalBuilder()
          .setCustomId('modal_set_field')
          .setTitle('Añadir campo');

        const nameInput = new TextInputBuilder()
          .setCustomId('field_name')
          .setLabel('Nombre del campo')
          .setStyle(TextInputStyle.Short);

        const valueInput = new TextInputBuilder()
          .setCustomId('field_value')
          .setLabel('Valor del campo')
          .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(
          new ActionRowBuilder().addComponents(nameInput),
          new ActionRowBuilder().addComponents(valueInput)
        );

        return interaction.showModal(modal);
      }

      // ============================
      // CANCELAR
      // ============================
      if (interaction.customId === 'cancel_embed') {
        delete sessions[interaction.user.id];
        return interaction.update({
          content: 'Embed cancelado.',
          embeds: [],
          components: []
        });
      }

      // ============================
      // ENVIAR
      // ============================
      if (interaction.customId === 'send_embed') {
        await session.channel.send({ embeds: [embed] });
        delete sessions[interaction.user.id];
        return interaction.update({
          content: 'Embed enviado.',
          embeds: [],
          components: []
        });
      }
    }

    // ============================
    // 3. MANEJO DE MODALES
    // ============================
    if (interaction.isModalSubmit()) {
      const session = sessions[interaction.user.id];
      if (!session) return;

      const embed = session.embed;
      const id = interaction.customId.replace('modal_', '');

      // ============================
      // FIELD
      // ============================
      if (id === 'set_field') {
        const name = interaction.fields.getTextInputValue('field_name');
        const value = interaction.fields.getTextInputValue('field_value');

        embed.addFields({ name, value });

        return interaction.update({
          content: 'Personaliza tu embed:',
          embeds: [embed],
          components: interaction.message.components
        });
      }

      // ============================
      // MODALES SIMPLES
      // ============================
      const value = interaction.fields.getTextInputValue('value');

      const colorMap = {
        rojo: '#ff0000',
        azul: '#0000ff',
        verde: '#00ff00',
        amarillo: '#ffff00',
        morado: '#8000ff',
        rosa: '#ff00ff',
        blanco: '#ffffff',
        negro: '#000000',
        naranja: '#ff8000',
        cyan: '#00ffff'
      };

      let finalColor = value.toLowerCase();
      if (colorMap[finalColor]) finalColor = colorMap[finalColor];
      if (/^[0-9a-f]{6}$/i.test(finalColor)) finalColor = `#${finalColor}`;

      switch (id) {
        case 'set_author':
          embed.setAuthor({ name: value });
          break;
        case 'set_title':
          embed.setTitle(value);
          break;
        case 'set_description':
          embed.setDescription(value);
          break;
        case 'set_color':
          try {
            embed.setColor(finalColor);
          } catch {
            return interaction.reply({
              content: '❌ Color inválido.',
              ephemeral: true
            });
          }
          break;
        case 'set_image':
          embed.setImage(value);
          break;
        case 'set_thumbnail':
          embed.setThumbnail(value);
          break;
        case 'set_footer':
          embed.setFooter({ text: value });
          break;
      }

      await interaction.update({
        content: 'Personaliza tu embed:',
        embeds: [embed],
        components: interaction.message.components
      });
    }
  }
};
