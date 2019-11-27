module.exports = {
    apps : [{
      name: "glitch-community",
      script: "./server/server.js",
      max_memory_restart: "3G", 
      instances : "1",
      exec_mode : "fork",
      watch: ["server", "shared", "views"],
      // Delay between restart
      watch_delay: 1000,
      ignore_watch : ["node_modules"],
      watch_options: {
        "followSymlinks": false
      }
    }]
}