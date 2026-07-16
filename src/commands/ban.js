const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  MessageFlags,
} = require("discord.js");

class BanCommand {
  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("ban")
      .setDescription("Ban a user")
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addUserOption((option) =>
        option.setName("user").setDescription("User to ban").setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Reason for ban")
          .setRequired(false),
      );
  }

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    if (interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const targetmember = interaction.options.getMember("user");
      const Reason =
        interaction.options.getString("reason") ?? "No reason provided";

      if (!targetmember) {
        await interaction.editRely({
          content: "User does not exist ",
          flags: MessageFlags.Ephemeral,
        });
      }

      try {
        await targetmember.ban({ Reason });
      } catch (error) {
          console.log(error);
      }
    } else {
      await interaction.editReply({ content: 'I do not have permission to execute this command', flags: MessageFlags.Ephemeral })
    }
  }
}

module.exports = new BanCommand();
