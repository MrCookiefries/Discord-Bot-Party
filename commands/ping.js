const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("sends pong back"),
  async execute(interaction) {
    await interaction.reply("pong");
  }
};
