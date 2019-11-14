module.exports = {
    apps : [{
      name: "glitch-community",
      script: "./server/server.js",
      instances : "1",
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
}