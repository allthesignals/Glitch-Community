module.exports = {
    apps : [{
      name: "glitch-community",
      script: "./server/server.js",
      instances : "1",
      max_memory_restart: "1G",
      instances : "max",
      exec_mode : "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
}