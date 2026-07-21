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

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

class LogsCommand {
  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("logs")
      .setDescription("Set logs channel")
      .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog)
      .addChannelOption((option) =>
        option.setName("channel").setDescription('Channel to set').setRequired(true),
      );
  }

  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const chnl = interaction.options.getChannel("channel");
    const guild_id = interaction.guildId

    const query = `
    INSERT INTO guild_logs (guild_id, channel_id) 
    VALUES($1, $2) 
    ON CONFLICT (guild_id) 
    DO UPDATE SET channel_id = EXCLUDED.channel_id`
    await pool.query(query, [guild_id, chnl.id]);

    await interaction.editReply({
      content: `${chnl} has been set for audit logs`,
      flags: MessageFlags.Ephemeral,
    });
  }
}

module.exports = new LogsCommand();