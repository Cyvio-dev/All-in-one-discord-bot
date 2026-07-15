const fs = require("fs");
const path = require("path");
const {
  GatewayIntentBits,
  Client,
  Collection,
  MessageFlags,
} = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

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
      command.execute(interaction);
    } catch (error) {
      console.log(error);
    }
  } else if (interaction.isButton()) {
    if (interaction.customId === "verify") {
      try {
        const role = interaction.guild.roles.cache.find(
          (r) => r.name === "Verified",
        );
        const member = interaction.member;
        await member.roles.add(role);
        await interaction.reply({
        content: "You have been verified!",
        flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
});

client.login(process.env.TOKEN);
