module.exports = {
  apps: [
    {
      name: "plm-web",
      script: "serve",
      exec_mode: "fork",
      instances: 1,
      env: {
        PM2_SERVE_PATH: "./dist",
        PM2_SERVE_PORT: 8546,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html",
      },
    },
  ],
};
