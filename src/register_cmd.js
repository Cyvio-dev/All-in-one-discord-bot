const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const commands = [];
const commands_path = path.join(__dirname, "commands");
const commands_files = fs.readdirSync(commands_path);

for (const file of commands_files) {
  const files = path.join(commands_path, file);
  const commands_files = require(files);

  commands.push(commands_files.data);
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

async function register() {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

register();