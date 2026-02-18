import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Advierte a un usuario.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario a advertir")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("razon")
        .setDescription("Razón del warn")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("razon");

    const warnsPath = path.resolve("src/data/warns.json");
    const configPath = path.resolve("src/data/warnConfig.json");

    // Crear archivo si no existe
    if (!fs.existsSync(warnsPath)) fs.writeFileSync(warnsPath, "{}");

    const warnsDB = JSON.parse(fs.readFileSync(warnsPath, "utf8"));
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    if (!warnsDB[user.id]) warnsDB[user.id] = [];

    warnsDB[user.id].push({
      moderator: interaction.user.id,
      reason,
      date: Date.now()
    });

    fs.writeFileSync(warnsPath, JSON.stringify(warnsDB, null, 2));

    // Embed público
    const embed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setTitle("⚠️ Usuario Advertido")
      .addFields(
        { name: "👤 Usuario", value: `${user.tag} (${user.id})` },
        { name: "📝 Razón", value: reason },
        { name: "👮 Moderador", value: interaction.user.tag }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Enviar DM al usuario
    const dmEmbed = new EmbedBuilder()
      .setColor("#ffcc00")
      .setTitle("⚠️ Has recibido un warn")
      .setDescription(
        `Has sido advertido en **${interaction.guild.name}**.\n\n` +
        `**Motivo:** ${reason}\n\n` +
        "Si crees que esto fue un error, contacta con el staff."
      )
      .setTimestamp();

    user.send({ embeds: [dmEmbed] }).catch(() => {});

    // Enviar log al canal configurado
    if (config.logChannel) {
      const logChannel = interaction.guild.channels.cache.get(config.logChannel);

      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor("#ff9900")
          .setTitle("📢 Nuevo Warn Registrado")
          .addFields(
            { name: "👤 Usuario", value: `${user.tag} (${user.id})` },
            { name: "📝 Razón", value: reason },
            { name: "👮 Moderador", value: `<@${interaction.user.id}>` },
            { name: "📅 Fecha", value: `<t:${Math.floor(Date.now() / 1000)}:f>` }
          )
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] });
      }
    }
  }
};

