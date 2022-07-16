const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("bans a member")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("the user to kick")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("reason for banning user")
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser("user");
    const member = interaction.guild.members.resolve(user);

    if (!member) {
      return interaction.reply(`User ${user} not found`);
    }

    if (!member.bannable) {
      return interaction.reply(`${user.tag} cannot be banned`);
    }

    if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      return interaction.reply("You're not allowed to ban");
    }

    const reason = interaction.options.getString("reason") || "they were bad";

    await member.ban({ reason });

    interaction.editReply(`Banned ${user.tag}`);
  }
};
