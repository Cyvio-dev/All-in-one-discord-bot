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
      await interaction.editReply({ content: `Message sent to ${chnl}`, flags: MessageFlags.Ephemeral });
      const msg_sent = await chnl.send({ content: `${msg}`, components: [row],});
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new VerifyCommand();