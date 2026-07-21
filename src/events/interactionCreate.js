const {
  MessageFlags,
  PermissionFlagsBits,
  PermissionOverwrites,
  ChannelType,
} = require("discord.js");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === "verify") {
        try {
          const role = interaction.guild.roles.cache.find(
            (r) => r.name === "Verified",
          );
          const member = interaction.member;
          await member.roles.add(role);
          await interaction.reply({
            content: "You have been verified!",
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          console.log(error);
        }
      } else if (interaction.customId === "create_ticket") {
        try {
          await interaction.deferReply({ flags: MessageFlags.Ephemeral });
          const user = interaction.user;
          const guild = interaction.guild;
          const channel = await guild.channels.create({
            name: `${user.username} ticket`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
              {
                id: user.id,
                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ReadMessageHistory,
                ],
              },
              {
                id: guild.id,
                deny: [PermissionFlagsBits.ViewChannel],
              },
            ],
          });
          await interaction.editReply({
            content: `Your ticket has been created ${channel}`,
            flags: MessageFlags.Ephemeral,
          });
        } catch (error) {
          await interaction.reply({ content: `${error}` });
        }
      }
    }
  });
};
