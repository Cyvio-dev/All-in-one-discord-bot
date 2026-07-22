const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  MessageFlags,
} = require("discord.js");

class KickCommand {
  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("kick")
      .setDescription("Kick a user")
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .addUserOption((option) =>
        option.setName("user").setDescription("User to kick").setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for kick")
          .setRequired(false),
      );
  }

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    if (interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
      const targetmember = interaction.options.getMember("user");
      const Reason = interaction.options.getString("reason") ?? "No reason provided";

      if (!targetmember) {
        await interaction.editRely({
          content: "User does not exist ",
          flags: MessageFlags.Ephemeral,
        });
      }

      try {
        await targetmember.kick({ Reason });
      } catch (error) {
          await interaction.editReply({ content: 'I do not have permission to kick this member', flags: MessageFlags.Ephemeral })
      }
    } else {
      await interaction.editReply({ content: 'I do not have permission to execute this command', flags: MessageFlags.Ephemeral })
    }
  }
}

module.exports = new KickCommand();
