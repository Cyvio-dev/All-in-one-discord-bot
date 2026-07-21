const { AuditLogEvent, Events } = require("discord.js");

module.exports = (client, pool) => {
  client.on(Events.GuildAuditLogEntryCreate, async (auditlog, guild) => {
    const { action, executorId, targetId, target } = auditlog;

    try {
      const dbresult = await pool.query(
        `SELECT channel_id FROM guild_logs WHERE guild_id = $1`,
        [guild.id],
      );

      if (!dbresult.rows || dbresult.rows.length === 0) return;

      const chnl_id = dbresult.rows[0].channel_id;
      const chnl = await guild.channels.fetch(chnl_id).catch(() => null);
      if (!chnl) return;
      
      const executor = executorId
        ? await client.users.fetch(executorId).catch(() => ({ tag: "Unknown" }))
        : { tag: "Unknown" };

      if (action === AuditLogEvent.MessageDelete) {
        const messageTarget = targetId
          ? await client.users.fetch(targetId).catch(() => ({ tag: "Unknown" }))
          : { tag: "Unknown" };

        await chnl.send({
          content: `Message by ${messageTarget.tag} was deleted by ${executor.tag}`,
        });
      } else if (action === AuditLogEvent.MemberKick) {
        const kickTarget = targetId
          ? await client.users.fetch(targetId).catch(() => ({ tag: "Unknown" }))
          : { tag: "Unknown" };

        await chnl.send({
          content: `${kickTarget.tag} was kicked by ${executor.tag}`,
        });
      } else if (action === AuditLogEvent.MemberBanAdd) {
        const banTarget = targetId
          ? await client.users.fetch(targetId).catch(() => ({ tag: "Unknown" }))
          : { tag: "Unknown" };

        await chnl.send({
          content: `${banTarget.tag} was banned by ${executor.tag}`,
        });
      } else if (action === AuditLogEvent.MemberBanRemove) {
        const unbanTarget = targetId
          ? await client.users.fetch(targetId).catch(() => ({ tag: "Unknown" }))
          : { tag: "Unknown" };

        await chnl.send({
          content: `${unbanTarget.tag} was unbanned by ${executor.tag}`,
        });
      } else if (action === AuditLogEvent.ChannelCreate) {
        const channelName = target?.name || "A channel";
        await chnl.send({
          content: `${channelName} was created by ${executor.tag}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
};