// configure environment variables
require("dotenv").config();

const {
  DISCORD_TOKEN: token,
  CLIENT_ID: clientId,
  GUILD_ID: guildId
} = process.env;

module.exports = {
  token,
  clientId,
  guildId
};
