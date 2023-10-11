module.exports = {
  apps : [{
    name   : "fsfe",
    script : "./index-ws.js",
    ignore_watch: ["node_modules", ".gitignore", "app.js", "package.json", , "package-lock.json"],
    watch: true,
  }]
}
