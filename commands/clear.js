const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("clears messages in a channel")
    .addIntegerOption(option =>
      option.setName("amount")
        .setDescription("count of messages to delete")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const amount = interaction.options.getInteger("amount");

    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return interaction.editReply("You're not allowed to delete messages");
    }

    await interaction.channel.bulkDelete(amount, true);

    interaction.editReply(`Deleted ${amount} messages`);
  }
};
