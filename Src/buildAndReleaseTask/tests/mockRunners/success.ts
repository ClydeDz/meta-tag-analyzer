import tmrm = require("azure-pipelines-task-lib/mock-run");
import path = require("path");

const taskPath: string = path.join(__dirname, "..", "..", "index.js");
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput("sitemapURL", "https://clydedsouza.net/sitemap.xml");

tmr.run();