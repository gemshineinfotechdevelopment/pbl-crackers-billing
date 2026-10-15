module.exports = {
  apps: [
    {
      name: 'pbl-billing-api',
      cwd: './server',
      script: 'dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 5018,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5018,
      },
    },
  ],
};
