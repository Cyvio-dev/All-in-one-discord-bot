const {
  MessageFlags,
  PermissionFlagsBits,
  PermissionOverwrites,
  ChatInputCommandInteraction,
  SlashCommandAssertions,
  SlashCommandBuilder,
} = require("discord.js");

class ClearCommand {
  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("clear")
      .setDescription("Clear messages")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addIntegerOption((option) =>
        option.setName("amount").setDescription("Amount of messages to delete"),
      );
  }

  /**
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    if (
      interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageChannels,
      )
    ) {
      const msg_amount = interaction.options.getInteger("amount");
      try {
        await interaction.channel.bulkDelete(msg_amount);
        await interaction.editReply({
          content: `Deleted ${msg_amount} messages from ${interaction.channel}`,
          flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        await interaction.editReply({ content: `Failed to delete the messages, ${error}`, flags: MessageFlags.Ephemeral });
      }
    } else {
        await interaction.reply({ content: 'I do not have permission to run this command', flags: MessageFlags.Ephemeral })
    }
  }
}

module.exports = new ClearCommand();