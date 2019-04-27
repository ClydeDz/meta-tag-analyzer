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
const exceljs_1 = require("exceljs");
const taskHelper_1 = require("./utilities/taskHelper");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.time("Execution time");
        const taskHelper = new taskHelper_1.TaskHelper();
        try {
            // Task inputs
            const sitemapURL = tl.getInput('sitemapURL', true);
            const outputFilename = tl.getInput('outputFilename', false);
            var reportFilename = outputFilename;
            taskHelper.printConsoleCopyright();
            // Validate the URL
            if (!taskHelper.isSitemapURLValid(sitemapURL)) {
                tl.setResult(tl.TaskResult.Failed, 'Invalid sitemap URL detected');
                return;
            }
            // Validate the file name
            if (!taskHelper.isOutputFilenameValid(outputFilename)) {
                console.log(outputFilename, "was determined to be of an invalid file format. Default file name has been assigned to the output file.");
                reportFilename = "meta-tag-analyzer-report";
            }
            taskHelper.printSitemapFileURL(sitemapURL);
            // Makes a request to the sitemap file and creates a virtual document 
            var virtualDocument = yield taskHelper.fetchURLAndLoadVirtualDocument(sitemapURL);
            var allPagesInSitemap = virtualDocument.querySelectorAll('loc');
            const metaElements = taskHelper.loadMetadataTagsIncluded();
            // Create EXCEL file and add first static row
            var wb = new exceljs_1.Workbook();
            var worksheet = wb.addWorksheet('Meta Data Analysis');
            worksheet = taskHelper.addExcelHeader(worksheet, metaElements);
            // Row 1 is the header of the table, that's why we're starting from 2
            var pageCounter = 2;
            // Loop thru all pages found in the sitemap file
            for (var i = 0; i < allPagesInSitemap.length; i++) {
                var currentURL = allPagesInSitemap[i].innerHTML;
                // Check if we need to exclude URLs. Example: .pdf
                if (!taskHelper.isPageURLValid(currentURL)) {
                    continue;
                }
                taskHelper.printPageURL(currentURL);
                worksheet.getRow(pageCounter).getCell(1).value = currentURL;
                // Makes a request to the sitemap file and creates a virtual document
                var virtualDocument = yield taskHelper.fetchURLAndLoadVirtualDocument(currentURL);
                // Title tag
                var titleTag = virtualDocument.querySelector('title');
                if (titleTag != null) {
                    console.log("   ", "→", "Title", "=", titleTag.innerHTML);
                    worksheet = taskHelper.addExcelCellContent(worksheet, pageCounter, taskHelper.getMetadataTagPosition('title-tag', metaElements), titleTag.innerHTML);
                }
                // Loop thru all meta tags
                var metaTags = virtualDocument.querySelectorAll('meta');
                for (var im = 0; im < metaTags.length; im++) {
                    var nameAttribute = metaTags[im].getAttribute('name');
                    var propertyAttribute = metaTags[im].getAttribute('property');
                    var isNameMetatag = nameAttribute != "" && nameAttribute != null;
                    var isPropertyMetatag = propertyAttribute != "" && propertyAttribute != null;
                    // Example: <meta name="description" content="Lorem ipsum">
                    if (isNameMetatag) {
                        if (nameAttribute == null) {
                            continue;
                        }
                        if (taskHelper.isKeyUnderNameAttrCategory(nameAttribute, metaElements)) {
                            var nameAttributeContent = metaTags[im].getAttribute('content');
                            if (nameAttributeContent != null) {
                                console.log("   ", "→", nameAttribute, "=", nameAttributeContent);
                                worksheet = taskHelper.addExcelCellContent(worksheet, pageCounter, taskHelper.getMetadataTagPosition(nameAttribute, metaElements), nameAttributeContent);
                            }
                        }
                    }
                    // Example: <meta property="og:type" content="website">
                    if (isPropertyMetatag) {
                        if (propertyAttribute == null) {
                            continue;
                        }
                        if (taskHelper.isKeyUnderPropertyAttrCategory(propertyAttribute, metaElements)) {
                            var propertyAttributeContent = metaTags[im].getAttribute('content');
                            if (propertyAttributeContent != null) {
                                console.log("   ", "→", propertyAttribute, "=", propertyAttributeContent);
                                worksheet = taskHelper.addExcelCellContent(worksheet, pageCounter, taskHelper.getMetadataTagPosition(propertyAttribute, metaElements), propertyAttributeContent);
                            }
                        }
                    }
                }
                pageCounter++;
            }
            worksheet = taskHelper.addExcelFooter(worksheet, ++pageCounter);
            wb.creator = "Clyde D'Souza";
            wb.lastModifiedBy = "Clyde D'Souza";
            wb.created = new Date();
            wb.xlsx.writeFile('./' + reportFilename + '.xlsx');
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
        finally {
            console.log();
            console.timeEnd("Execution time");
        }
    });
}
run();
