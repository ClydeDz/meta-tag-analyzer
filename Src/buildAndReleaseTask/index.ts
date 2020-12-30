import * as tl from 'azure-pipelines-task-lib/task';
import { Workbook } from 'exceljs';

import { TaskUtil } from "./utilities/taskUtil";
import { ConsoleUtil } from "./utilities/consoleUtil";
import { ExcelUtil } from "./utilities/excelUtil";
import { AppConstants } from "./constants/appConstants";

async function run() {
    console.time("Execution time");
    const taskUtil = new TaskUtil();
    const consoleUtil = new ConsoleUtil();
    const excelUtil = new ExcelUtil();
    const appConstants = new AppConstants();

    try {
        // Task inputs
        const sitemapURL: string | undefined = tl.getInput('sitemapURL', true);
        const outputFilename: string | undefined = tl.getInput('outputFilename', false);
        var reportFilename = outputFilename;

        consoleUtil.printConsoleCopyright();

        // Validate the URL
        if (!taskUtil.isSitemapURLValid(sitemapURL)) {
            tl.setResult(tl.TaskResult.Failed, 'Invalid sitemap URL detected');
            return;
        }

        // Validate the file name
        if (!taskUtil.isOutputFilenameValid(outputFilename)) {
            console.log("Filename", taskUtil.getTransformedInvalidOutputFilename(outputFilename), "was determined to be of an invalid file format. Default file name has been assigned to the output file.");
            reportFilename = "meta-tag-analyzer-report";
        }

        consoleUtil.printSitemapFileURL(sitemapURL);

        var virtualDocument = await taskUtil.fetchURLAndLoadVirtualDocument(sitemapURL);
        const metaElements = appConstants.getMetadataTagsIncluded();

        // Create EXCEL file and add first static row
        var wb = new Workbook();
        var worksheet = wb.addWorksheet(appConstants.reportWorksheetName);
        worksheet = excelUtil.addExcelHeader(worksheet, metaElements);

        // Row 1 is the header of the table, that's why we're starting from 2
        var rowCounter = 2;

        // A valid sitemap file needs to have the <loc> tag
        var allPagesInSitemap = virtualDocument.querySelectorAll('loc');

        // Loop thru all pages found in the sitemap file
        for (var i = 0; i < allPagesInSitemap.length; i++) {
            var currentURL = allPagesInSitemap[i].innerHTML;

            // Check if we need to exclude URLs. Example: .pdf
            if (!taskUtil.isPageURLValid(currentURL)) {
                continue;
            }

            consoleUtil.printPageURL(currentURL);
            worksheet.getRow(rowCounter).getCell(1).value = currentURL;
            worksheet.getRow(rowCounter).getCell(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF0E68C' }
            };

            // Makes a request to the sitemap file and creates a virtual document
            var virtualDocument = await taskUtil.fetchURLAndLoadVirtualDocument(currentURL);

            // Title tag
            var titleTag = virtualDocument.querySelector('title');
            if (titleTag != null) {
                worksheet = taskUtil.processTitleTag(titleTag.innerHTML, metaElements, worksheet, rowCounter);
            }

            // H1 tag
            var h1Tags = virtualDocument.querySelectorAll('h1');
            if (h1Tags != null) {
                worksheet = taskUtil.processH1Tag(
                    h1Tags,
                    metaElements,
                    worksheet,
                    rowCounter);
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

                    // Filters only those meta tags we're interested in
                    worksheet = taskUtil.processNameMetaTags(nameAttribute, metaElements, metaTags[im], worksheet, rowCounter);
                }

                // Example: <meta property="og:type" content="website">
                if (isPropertyMetatag) {
                    if (propertyAttribute == null) {
                        continue;
                    }

                    // Filters only those meta tags we're interested in
                    worksheet = taskUtil.processPropertyMetaTags(propertyAttribute, metaElements, metaTags[im], worksheet, rowCounter);
                }
            }

            rowCounter++;
        }

        worksheet = excelUtil.addExcelFooter(worksheet, ++rowCounter);
        wb.creator = "Clyde D'Souza";
        wb.lastModifiedBy = "Clyde D'Souza";
        wb.created = new Date();
        wb.xlsx.writeFile('./' + reportFilename + '.xlsx');
        console.log();
        console.log(reportFilename + '.xlsx created successfully.');
    }
    catch (err) {
        console.log();
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
    finally {
        console.timeEnd("Execution time");
        console.log();
    }
}

// Start here
run();


