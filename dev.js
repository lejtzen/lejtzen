const chokidar = require("chokidar");
const browserSync = require("browser-sync").create();
const { exec } = require("child_process");
const root = "./dist/";
const port = 3000;
const files = ["README.md", "template.html"];

browserSync.init({
  server: root,
  port: port,
  open: false,
  notify: false,
  ui: false,
  ghostMode: false,
});

const watcher = chokidar.watch(files, {
  persistent: true,
  ignoreInitial: true,
});

console.log(`🚀 Dev server started at http://localhost:${port}`);
console.log(`👀 Watching files ${files.join(", ")}`);

watcher.on("all", (event, path) => {
  console.log(`\nRebuilding ${event} on ${path}`);

  exec("node build.js", (err) => {
    if (err) {
      console.error("❌ Build Error:", err.message);
    } else {
      console.log("✅ Build successful.");
      browserSync.reload();
    }
  });
});
