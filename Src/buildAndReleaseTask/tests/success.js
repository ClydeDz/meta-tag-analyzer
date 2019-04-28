"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tmrm = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
let taskPath = path.join(__dirname, '..', 'index.js');
let tmr = new tmrm.TaskMockRunner(taskPath);
tmr.setInput('sitemapURL', 'https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/master/Sample/sitemap.xml');
tmr.run();
