import {LeagueKey} from "./src/models/kicker/leagues";

module.exports = {
  apps: [
    {
      name: "tipp.rohmer.rocks",
      script: "__sapper__/build",
      watch: false,
      env: {
        PORT: 8002,
        TIPP_SESSION_SECRET: '#{SESSION_SECRET}#',
        TIPP_SESSION_PATH: '#{SESSION_PATH}#',
        TIPP_MONGO_DB_CONNECTION_STR: '#{MONGO_DB_CONNECTION_STR}#',
        TIPP_AUTH_DOMAIN: '#{AUTH_DOMAIN}#',
        TIPP_AUTH_ID: '#{AUTH_ID}#',
        TIPP_AUTH_SECRET: '#{AUTH_SECRET}#',
        TIPP_AUTH_CALLBACK_URL: '#{AUTH_CALLBACK_URL}#',
        TIPP_AUTH_LOGOUT_REDIRECT_URL: '#{AUTH_LOGOUT_REDIRECT_URL}#',
        TIPP_PUSH_PRIVATE: '#{PUSH_PRIVATE}#',
        TIPP_PUSH_MAIL: '#{PUSH_MAIL}#',
      },
    },
  ],
};
