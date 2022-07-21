const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("unbans a member")
    .addStringOption(option =>
      option.setName("id")
        .setDescription("the id of the user to unban")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("reason for unbanning user")
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      return interaction.editReply("You're not allowed to unban");
    }

    const userId = interaction.options.getString("id");
    const bannedUsers = await interaction.guild.bans.fetch();
    const bannedUser = bannedUsers.find(banned => banned.user.id === userId);

    if (!bannedUser) {
      return interaction.editReply(`${userId} not in ban list`);
    }

    const reason = interaction.options.getString("reason") || "they are fine";

    await interaction.guild.members.unban(bannedUser.user.id, reason);

    interaction.editReply(`Unbanned ${bannedUser.user.tag}`);
  }
};
