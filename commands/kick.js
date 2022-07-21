const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kicks a member")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("the user to kick")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("reason for kicking user")
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
      return interaction.editReply("You're not allowed to kick");
    }

    const user = interaction.options.getUser("user");
    const member = interaction.guild.members.resolve(user);

    if (!member) {
      return interaction.editReply(`${user} not found`);
    }

    if (!member.kickable) {
      return interaction.editReply(`${member.user.tag} cannot be kicked`);
    }

    const reason = interaction.options.getString("reason") || "they were bad";

    await member.kick({ reason });

    interaction.editReply(`Kicked ${member.user.tag}`);
  }
};
