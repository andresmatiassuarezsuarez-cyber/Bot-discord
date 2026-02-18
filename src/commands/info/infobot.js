import {
  SlashCommandBuilder,
  EmbedBuilder,
  version as djsVersion
} from "discord.js";
import os from "os";

export default {
  data: new SlashCommandBuilder()
    .setName("infobot")
    .setDescription("Muestra información completa del bot."),

  async execute(interaction) {
    const client = interaction.client;

    // Uptime formateado
    const totalSeconds = Math.floor(client.uptime / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    // Banner del bot
    let bannerURL = null;
    try {
      const fetchedBot = await client.users.fetch(client.user.id, { force: true });
      bannerURL = fetchedBot.bannerURL({ size: 1024 });
    } catch {}

    const embed = new EmbedBuilder()
      .setColor("#00aaff")
      .setTitle("🤖 Información del Bot")
      .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
      .addFields(
        {
          name: "📌 Nombre",
          value: client.user.tag,
          inline: true
        },
        {
          name: "🆔 ID",
          value: client.user.id,
          inline: true
        },
        {
          name: "👑 Creador",
          value: "Matteo (el único y original 😎)",
          inline: false
        },
        {
          name: "📅 Creado el",
          value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}:f>`,
          inline: false
        },
        {
          name: "📡 Ping",
          value: `${client.ws.ping}ms`,
          inline: true
        },
        {
          name: "🕒 Uptime",
          value: uptime,
          inline: true
        },
        {
          name: "🌍 Servidores",
          value: `${client.guilds.cache.size}`,
          inline: true
        },
        {
          name: "👥 Usuarios totales",
          value: `${client.users.cache.size}`,
          inline: true
        },
        {
          name: "💬 Canales",
          value: `${client.channels.cache.size}`,
          inline: true
        },
        {
          name: "⚙️ Discord.js",
          value: djsVersion,
          inline: true
        },
        {
          name: "🟩 Node.js",
          value: process.version,
          inline: true
        },
        {
          name: "🖥️ Sistema",
          value: `${os.type()} ${os.release()}`,
          inline: false
        }
      )
      .setFooter({ text: "Información general del bot" })
      .setTimestamp();

    // Si tiene banner, lo añadimos
    if (bannerURL) embed.setImage(bannerURL);

    await interaction.reply({ embeds: [embed] });
  }
};
