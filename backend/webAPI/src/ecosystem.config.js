require('dotenv').config();

module.exports = {
    apps: [
      {
        name: 'webapi',
        script: 'dist/index.js', // Compiled JavaScript file
        watch: true,
        ignore_watch: ['node_modules','uploads','*.csv','dist'],
        max_restarts: 10, // Maximum restarts within 60 seconds
        restart_delay: 1000, // Delay between restarts in milliseconds (1 second)
        instances: '1',
        exec_mode: 'cluster',
        autorestart: true,
        env: {

        }
      },
    ],
  };
  