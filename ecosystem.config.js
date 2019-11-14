module.exports = {
    apps : [{
      name: "glitch-community",
      script: "./server/server.js",
      instances : "1",
      max_memory_restart: "1G", // This will restart gracefully the service if it takes 1GB
      instances : "max", // This will spin up 2-3 instances
      exec_mode : "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
}