module.exports = {
  apps: [
    {
      name: "tipp.rohmer.rocks",
      script: "index.js",
      watch: false,
      env: {
        PORT: 8002,
      },
    },
  ],
};
