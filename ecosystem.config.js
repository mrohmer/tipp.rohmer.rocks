module.exports = {
  apps: [
    {
      name: "tipp.rohmer.rocks",
      script: "__sapper__/build",
      watch: false,
      env: {
        PORT: 8002,
      },
    },
  ],
};
