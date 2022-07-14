const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

// attach the commands reference to client
client.commands = new Collection();
// read the js files from commands dir
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  // import each command file & add to collection
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// log status
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});
client.once("disconnect", () => {
  console.log("Disconnected.");
});

// hande newly made interactions
client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand() || !interaction.guildId) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.followUp({
      content: "Oh no! The command resulted in an error.",
      ephemeral: true
    });
  }
});

client.login(token);
