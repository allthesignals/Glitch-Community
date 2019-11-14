module.exports = {
    apps : [{
      name: "glitch-community",
      script: "./server/server.js",
      instances : "max",
      exec_mode : "cluster",
      max_memory_restart: "1G"
    }]
}