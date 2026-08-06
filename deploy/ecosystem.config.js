// PM2 process definition. Run from the project root:
//   pm2 start deploy/ecosystem.config.js
//   pm2 save && pm2 startup   (once, so it survives a VPS reboot)
//
// `output: "standalone"` means the actual thing we run is the traced
// server.js under .next/standalone/ — see deploy/deploy.sh, which copies
// public/, .next/static/, and .env.production into that folder on every
// build before (re)starting this process.
module.exports = {
  apps: [
    {
      name: "dalma-web",
      script: "server.js",
      cwd: "./.next/standalone",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      out_file: "/var/log/dalma-web/out.log",
      error_file: "/var/log/dalma-web/error.log",
      time: true,
    },
  ],
};
