import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra todos los comandos disponibles'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setTitle('📘 Lista de comandos')
      .setDescription('Aquí tienes todos los comandos disponibles en el bot.')
      .addFields(
        {
          name: '🛠️ Administración',
          value:
            '`/embed` — Crea un embed personalizado con botones y modales.\n' +
            '`/clear` — Borra mensajes del canal.\n' +
            '`/say` — El bot envía un mensaje personalizado.'
        },
        {
          name: 'ℹ️ Información',
          value:
            '`/help` — Muestra este panel de ayuda.\n' +
            '`/ping` — Muestra la latencia del bot.'
        }
      )
      .setFooter({ text: 'Creativos RP • Sistema de ayuda' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Servidor de soporte')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.gg/tu-servidor'),

      new ButtonBuilder()
        .setLabel('Invitar bot')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.com/oauth2/authorize?client_id=TU_ID&permissions=8&scope=bot%20applications.commands')
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};
