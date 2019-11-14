module.exports = {
    apps : [{
      name: "glitch-community",
      script: "./server/server.js",
      instances : "1",
      max_memory_restart: "1G"
    }]
}