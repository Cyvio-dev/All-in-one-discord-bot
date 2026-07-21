const fs = require("fs");
const path = require("path");
const {
  GatewayIntentBits,
  Client,
  Collection,
  MessageFlags,
  ChannelType,
  PermissionOverwrites,
  PermissionFlagsBits,
} = require("discord.js");
const { type } = require("os");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false},
})

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
  ],
});

require("./events/interactionCreate")(client);
require("./events/guildAuditLogEntryCreate")(client, pool);

client.commands = new Collection();

const commands_path = path.join(__dirname, "commands");
const commands_file = fs.readdirSync(commands_path);

for (const file of commands_file) {
  const files = path.join(commands_path, file);
  const command = require(files);

  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`${files} is missing the required data or execute function!`);
  }
}

client.on("clientReady", () => {
  console.log("Bot is ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.log(`No command matching ${interaction.commandName} was found!`);
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.log(error);
    }

  }
})

client.login(process.env.TOKEN);
