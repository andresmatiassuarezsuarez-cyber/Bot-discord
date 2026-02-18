import {
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Muestra información detallada de un usuario.")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario del que quieres ver la información")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    // Obtener banner del usuario
    let bannerURL = null;
    try {
      const fetchedUser = await interaction.client.users.fetch(user.id, { force: true });
      bannerURL = fetchedUser.bannerURL({ size: 1024 });
    } catch {}

    // Badges del usuario
    const flags = user.flags?.toArray() || [];
    const badgeEmojis = {
      Staff: "🛠️",
      Partner: "🤝",
      Hypesquad: "🎉",
      HypeSquadOnlineHouse1: "🏠",
      HypeSquadOnlineHouse2: "🏠",
      HypeSquadOnlineHouse3: "🏠",
      BugHunterLevel1: "🐛",
      BugHunterLevel2: "🐞",
      PremiumEarlySupporter: "💎",
      VerifiedDeveloper: "👨‍💻",
      CertifiedModerator: "🛡️",
      ActiveDeveloper: "⚡"
    };

    const badges = flags.map(f => badgeEmojis[f] || f).join(" ") || "Ninguna";

    // Roles del usuario
    const roles = member
      ? member.roles.cache
          .filter(r => r.id !== interaction.guild.id)
          .sort((a, b) => b.position - a.position)
          .map(r => r.toString())
          .join(", ")
      : "No disponible";

    const embed = new EmbedBuilder()
      .setColor("#00aaff")
      .setTitle(`Información de ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ size: 1024 }))
      .addFields(
        {
          name: "👤 Usuario",
          value: `${user.tag}\n**ID:** ${user.id}`
        },
        {
          name: "📅 Cuenta creada",
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:f>\n<t:${Math.floor(user.createdTimestamp / 1000)}:R>`
        },
        {
          name: "📥 Se unió al servidor",
          value: member
            ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>\n<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
            : "No disponible"
        },
        {
          name: "🎖️ Badges",
          value: badges
        },
        {
          name: "📌 Roles",
          value: roles || "Sin roles"
        }
      )
      .setFooter({ text: "Información del usuario" })
      .setTimestamp();

    // Si tiene banner, lo añadimos
    if (bannerURL) embed.setImage(bannerURL);

    await interaction.reply({ embeds: [embed] });
  }
};
