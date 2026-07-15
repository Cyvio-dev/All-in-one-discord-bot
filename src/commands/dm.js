const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  MessageFlags,
} = require("discord.js");

class DmCommand {
  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("dm")
      .setDescription("dm a user")
      .addUserOption((option) =>
        option.setName("user").setDescription("User to dm").setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("message")
          .setDescription("Message for user")
          .setRequired(true),
      );
  }

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const targetmember = interaction.options.getMember("user");
    const Message = interaction.options.getString("message");

    if (!targetmember) {
      await interaction.editRely({
        content: "User does not exist ",
        flags: MessageFlags.Ephemeral,
      });
    } else if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ModerateMembers,
      )
    ) {
      await interaction.editReply({
        content: "I do not have permission to dm this user! ",
        flags: MessageFlags.Ephemeral,
      });
    } else if (!targetmember.moderatable) {
      await interaction.editReply({
        content: "User cannot be DMed!",
        flags: MessageFlags.Ephemeral,
      });
    } else if (
      !interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)
    ) {
      await interaction.editReply({
        content: "You do not have permission to DM this member! ",
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await targetmember.send({ Message });
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = new DmCommand();