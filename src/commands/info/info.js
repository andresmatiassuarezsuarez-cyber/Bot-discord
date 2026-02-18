import {
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Muestra información completa del servidor."),

  async execute(interaction) {
    const guild = interaction.guild;

    // Obtener owner
    const owner = await guild.fetchOwner();

    // Contar miembros
    const totalMembers = guild.memberCount;
    const bots = guild.members.cache.filter(m => m.user.bot).size;
    const humans = totalMembers - bots;

    // Contar canales
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const categories = guild.channels.cache.filter(c => c.type === 4).size;

    // Roles
    const roles = guild.roles.cache.size;

    // Emojis y stickers
    const emojis = guild.emojis.cache.size;
    const stickers = guild.stickers.cache.size;

    // Boosts
    const boosts = guild.premiumSubscriptionCount;
    const boostLevel = guild.premiumTier;

    // Banner del servidor
    const banner = guild.bannerURL({ size: 1024 });

    const embed = new EmbedBuilder()
      .setColor("#00aaff")
      .setTitle(`📊 Información del Servidor`)
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .addFields(
        {
          name: "🏷️ Nombre",
          value: guild.name,
          inline: true
        },
        {
          name: "🆔 ID",
          value: guild.id,
          inline: true
        },
        {
          name: "👑 Dueño",
          value: `${owner.user.tag} (${owner.id})`,
          inline: false
        },
        {
          name: "📅 Creado el",
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:f>\n<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
          inline: false
        },
        {
          name: "👥 Miembros",
          value: `Total: **${totalMembers}**\n👤 Humanos: **${humans}**\n🤖 Bots: **${bots}**`,
          inline: true
        },
        {
          name: "📂 Canales",
          value:
            `💬 Texto: **${textChannels}**\n🔊 Voz: **${voiceChannels}**\n📁 Categorías: **${categories}**`,
          inline: true
        },
        {
          name: "🎭 Roles",
          value: `${roles}`,
          inline: true
        },
        {
          name: "😃 Emojis & Stickers",
          value: `Emojis: **${emojis}**\nStickers: **${stickers}**`,
          inline: true
        },
        {
          name: "🚀 Boosts",
          value: `Boosts: **${boosts}**\nNivel: **${boostLevel}**`,
          inline: true
        },
        {
          name: "🔒 Nivel de verificación",
          value: `${guild.verificationLevel}`,
          inline: false
        }
      )
      .setFooter({ text: "Información del servidor" })
      .setTimestamp();

    // Si tiene banner, lo añadimos
    if (banner) embed.setImage(banner);

    await interaction.reply({ embeds: [embed] });
  }
};
