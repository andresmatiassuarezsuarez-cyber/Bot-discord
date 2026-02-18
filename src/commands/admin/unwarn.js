import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
  data: new SlashCommandBuilder()
    .setName("unwarn")
    .setDescription("Elimina un warn de un usuario.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario al que deseas quitar un warn")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("numero")
        .setDescription("Número del warn a eliminar (1, 2, 3...). Si no pones nada, se borran todos.")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const warnNumber = interaction.options.getInteger("numero");

    const warnsPath = path.resolve("src/data/warns.json");
    const configPath = path.resolve("src/data/warnConfig.json");

    // Crear archivo si no existe
    if (!fs.existsSync(warnsPath)) fs.writeFileSync(warnsPath, "{}");

    const warnsDB = JSON.parse(fs.readFileSync(warnsPath, "utf8"));
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    if (!warnsDB[user.id] || warnsDB[user.id].length === 0) {
      return interaction.reply({
        content: "⚠️ Ese usuario **no tiene warns registrados**.",
        ephemeral: true
      });
    }

    let removedWarn;

    // Si no se especifica número → borrar todos
    if (!warnNumber) {
      removedWarn = [...warnsDB[user.id]];
      delete warnsDB[user.id];
    } else {
      const index = warnNumber - 1;

      if (!warnsDB[user.id][index]) {
        return interaction.reply({
          content: "❌ Ese número de warn **no existe**.",
          ephemeral: true
        });
      }

      removedWarn = warnsDB[user.id][index];
      warnsDB[user.id].splice(index, 1);

      if (warnsDB[user.id].length === 0) {
        delete warnsDB[user.id];
      }
    }

    fs.writeFileSync(warnsPath, JSON.stringify(warnsDB, null, 2));

    // Embed público
    const embed = new EmbedBuilder()
      .setColor("#00ff99")
      .setTitle("🧹 Warn Eliminado")
      .addFields(
        { name: "👤 Usuario", value: `${user.tag} (${user.id})` },
        {
          name: "📝 Acción",
          value: warnNumber
            ? `Se eliminó el warn **#${warnNumber}**`
            : "Se eliminaron **todos los warns**"
        },
        { name: "👮 Moderador", value: interaction.user.tag }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Enviar log al canal configurado
    if (config.logChannel) {
      const logChannel = interaction.guild.channels.cache.get(config.logChannel);

      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor("#00ff99")
          .setTitle("🧹 Warn Eliminado (Log)")
          .addFields(
            { name: "👤 Usuario", value: `${user.tag} (${user.id})` },
            {
              name: "📝 Acción",
              value: warnNumber
                ? `Se eliminó el warn **#${warnNumber}**`
                : "Se eliminaron **todos los warns**"
            },
            { name: "👮 Moderador", value: `<@${interaction.user.id}>` },
            { name: "📅 Fecha", value: `<t:${Math.floor(Date.now() / 1000)}:f>` }
          )
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] });
      }
    }
  }
};
