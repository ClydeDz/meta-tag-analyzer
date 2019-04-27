"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = __importStar(require("azure-pipelines-task-lib/task"));
const WebRequest = __importStar(require("web-request"));
const domino = __importStar(require("domino"));
const taskHelper_1 = require("./utilities/taskHelper");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.time("Execution time");
        const taskHelper = new taskHelper_1.TaskHelper();
        try {
            const sitemapURL = tl.getInput('sitemapURL', true);
            // Validate the URL
            if (!taskHelper.isURLValid(sitemapURL)) {
                tl.setResult(tl.TaskResult.Failed, 'Invalid sitemap URL detected');
                return;
            }
            console.log('Sitemap file:', sitemapURL);
            // Makes a request to the sitemap file and creates a virtual document
            var sitemapXHRResult = yield WebRequest.get(sitemapURL);
            var virtualDocument = domino.createWindow(sitemapXHRResult.content).document;
            var allPagesInSitemap = virtualDocument.querySelectorAll('loc');
            // Loop thru all pages found in the sitemap file
            for (var i = 0; i < allPagesInSitemap.length; i++) {
                // TODO: Check if we need to exclude the URL. Example: .pdf URL
                // if (allPagesInSitemap[i].innerHTML.toString()) {
                //     continue;
                // }
                var currentURL = allPagesInSitemap[i].innerHTML;
                console.log("URL:", currentURL);
                console.log("-----------------");
                // Makes a request to the sitemap file and creates a virtual document
                var currentURLXHRResult = yield WebRequest.get(currentURL);
                var virtualDocument = domino.createWindow(currentURLXHRResult.content).document;
                // Title 
                var titleTag = virtualDocument.querySelectorAll('title');
                // Loop thru all meta tags
                var metaTags = virtualDocument.querySelectorAll('meta');
                for (var im = 0; im < metaTags.length; im++) {
                    var nameAttribute = metaTags[im].getAttribute('name');
                    var propertyAttribute = metaTags[im].getAttribute('property');
                    var isNameMetatag = nameAttribute != "" && nameAttribute != null;
                    var isPropertyMetatag = propertyAttribute != "" && propertyAttribute != null;
                    // Example: <meta name="description" content="Lorem ipsum">
                    if (isNameMetatag) {
                        if (nameAttribute == "title" || nameAttribute == "description") {
                            var nameAttributeContent = metaTags[im].getAttribute('content');
                            console.log("   ", nameAttribute, "=", nameAttributeContent);
                        }
                    }
                    //Example: <meta property="og:type" content="website">
                    if (isPropertyMetatag) {
                        if (propertyAttribute == "og:type" || propertyAttribute == "og:url") {
                            var propertyAttributeContent = metaTags[im].getAttribute('content');
                            console.log("   ", propertyAttribute, "=", propertyAttributeContent);
                        }
                    }
                }
            }
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
        finally {
            console.timeEnd("Execution time");
        }
    });
}
run();
