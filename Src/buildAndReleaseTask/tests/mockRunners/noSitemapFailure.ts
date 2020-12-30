import tmrm = require("azure-pipelines-task-lib/mock-run");
import path = require("path");

const taskPath = path.join(__dirname, "..", "..", "index.js");
const tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
tmr.setInput("sitemapURL", "");
tmr.run();