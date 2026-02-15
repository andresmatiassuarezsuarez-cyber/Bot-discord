import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Borra mensajes del chat de forma segura.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
      option
        .setName("cantidad")
        .setDescription("Cantidad de mensajes a borrar (1-100)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger("cantidad");

    // Validación de rango
    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: "❌ Debes elegir un número entre **1 y 100**.",
        ephemeral: true
      });
    }

    // Verificar permisos del bot
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: "❌ No tengo permisos para borrar mensajes.",
        ephemeral: true
      });
    }

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);

      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("🧹 Mensajes eliminados")
        .setDescription(`Se borraron **${deleted.size}** mensajes correctamente.`)
        .setFooter({
          text: `Solicitado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

      const reply = await interaction.reply({ embeds: [embed] });

      // Borrar el mensaje de confirmación después de 5 segundos
      setTimeout(() => {
        reply.delete().catch(() => {});
      }, 5000);

    } catch (error) {
      console.error("Error al borrar mensajes:", error);

      return interaction.reply({
        content: "❌ No pude borrar algunos mensajes.  
Esto suele pasar si tienen más de **14 días**.",
        ephemeral: true
      });
    }
  }
};
