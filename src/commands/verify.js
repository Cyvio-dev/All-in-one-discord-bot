const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  MessageFlags,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Message,
} = require("discord.js");

class VerifyCommand {
  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("verification")
      .setDescription("Set a verification channel")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Set a verification channel")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("message")
          .setDescription("Set a verification message")
          .setRequired(true),
      );
  }

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    if (interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const chnl = interaction.options.getChannel("channel");
      const msg = interaction.options.getString("message");

      const verify_button = new ButtonBuilder()
      .setCustomId('verify')
      .setLabel('Verify yourself')
      .setStyle(ButtonStyle.Success)

      const row = new ActionRowBuilder()
      .addComponents(verify_button)

      try {
        await chnl.send({ content: `${msg}`, components: [row],});
        await interaction.editReply({ content: `Message sent to ${chnl}`, flags: MessageFlags.Ephemeral });
      } catch (error) {
        console.log(error);
      }
    } else {
      await interaction.editReply({ content: 'I do not have permission to execute this command', flags: MessageFlags.Ephemeral })
    }
  }
}

module.exports = new VerifyCommand();