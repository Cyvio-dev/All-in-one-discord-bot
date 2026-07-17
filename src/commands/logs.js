const {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  AuditLogEvent,
  Events,
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  GuildExplicitContentFilter,
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.GuildModeration],
});

class LogsCommand {
  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("logs")
      .setDescription("Set logs channel")
      .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
      .addChannelOption((option) =>
        option.setName("channel").setRequired(true),
      );
  }

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const chnl = interaction.options.getChannel("channel");
    await interaction.editReply({
      content: `${chnl} has been set for audit logs`,
      flags: MessageFlags.Ephemeral,
    });
  }
}

client.on(Events.GuildAuditLogEntryCreate, async (auditlog) => {
  const { action, executorId, targetId } = auditlog;
  const executor = await client.users.fetch(executorId);
  const target = await client.users.fetch(targetId);

  try {
    if (action === AuditLogEvent.MessageDelete) {
      await chnl.send({
        content: `Message by ${target.tag} was deleted by ${executor.tag}`,
      });
    } else if (action === AuditLogEvent.MemberKick) {
      await chnl.send({
        content: `${target.tag} was kicked by ${executor.tag}`,
      });
    } else if (action === AuditLogEvent.MemberBanAdd) {
      await chnl.send({
        content: `${target.tag} was banned by ${executor.tag}`,
      });
    } else if (action === AuditLogEvent.MemberBanRemove) {
      await chnl.send({
        content: `${target.tag} was unbanned by ${executor.tag}`,
      });
    } else if (action == AuditLogEvent.ChannelCreate) {
      await chnl.send({
        content: `${target.tag} was created by ${executor.tag}`,
      });
    }
  } catch (error) {
    console.log(error);
  }
});
