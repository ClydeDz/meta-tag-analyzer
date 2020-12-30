import * as tl from "azure-pipelines-task-lib/task";
import { Workbook, Worksheet } from "exceljs";

import { TaskUtil } from "./utilities/taskUtil";
import { ConsoleUtil } from "./utilities/consoleUtil";
import { ExcelUtil } from "./utilities/excelUtil";
import { AppConstants, MetadataTagsIncluded } from "./constants/appConstants";

async function run(): Promise<void> {
    console.time("Execution time");
    const taskUtil: TaskUtil = new TaskUtil();
    const consoleUtil: ConsoleUtil = new ConsoleUtil();
    const excelUtil: ExcelUtil = new ExcelUtil();
    const appConstants: AppConstants = new AppConstants();

    try {
        const sitemapURL: string | undefined = tl.getInput("sitemapURL", true);
        const outputFilename: string | undefined = tl.getInput("outputFilename", false);
        let reportFilename: string | undefined = outputFilename;

        consoleUtil.printConsoleCopyright();

        // validate the URL
        if (!taskUtil.isSitemapURLValid(sitemapURL)) {
            tl.setResult(tl.TaskResult.Failed, "Invalid sitemap URL detected");
            return;
        }

        // validate the file name
        if (!taskUtil.isOutputFilenameValid(outputFilename)) {
            console.log("Filename", taskUtil.getTransformedInvalidOutputFilename(outputFilename),
                "was determined to be of an invalid file format. Default file name has been assigned to the output file.");
            reportFilename = "meta-tag-analyzer-report";
        }

        consoleUtil.printSitemapFileURL(sitemapURL);

        const virtualDocument: Document = await taskUtil.fetchURLAndLoadVirtualDocument(sitemapURL);
        const metaElements: MetadataTagsIncluded[] = appConstants.getMetadataTagsIncluded();

        // create EXCEL file and add first static row
        const wb: Workbook = new Workbook();
        let worksheet: Worksheet = wb.addWorksheet(appConstants.reportWorksheetName);
        worksheet = excelUtil.addExcelHeader(worksheet, metaElements);

        // row 1 is the header of the table, that's why we're starting from 2
        let rowCounter: number = appConstants.startingRowNumber;

        // a valid sitemap file needs to have the <loc> tag
        const allPagesInSitemap: NodeListOf<Element> = virtualDocument.querySelectorAll("loc");

        // loop thru all pages found in the sitemap file
        for (let i = 0; i < allPagesInSitemap.length; i++) {
            const currentURL: string = allPagesInSitemap[i].innerHTML;

            // check if we need to exclude URLs. Example: .pdf
            if (!taskUtil.isPageURLValid(currentURL)) {
                continue;
            }

            consoleUtil.printPageURL(currentURL);
            worksheet.getRow(rowCounter).getCell(1).value = currentURL;
            worksheet.getRow(rowCounter).getCell(1).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF0E68C" }
            };

            // makes a request to the sitemap file and creates a virtual document
            let virtualDocument: Document;
            try {
                virtualDocument = await taskUtil.fetchURLAndLoadVirtualDocument(currentURL);
            } catch (err) {
                console.log(`There was an issue with retrieving the contents from ${currentURL}. Please check the URL provided.`);
                continue;
            }

            // <title>
            const titleTag: HTMLTitleElement | null = virtualDocument.querySelector("title");
            if (titleTag != null) {
                worksheet = taskUtil.processTitleTag(titleTag.innerHTML, metaElements, worksheet, rowCounter);
            }

            // <h1>
            const h1Tags: NodeListOf<HTMLHeadingElement> = virtualDocument.querySelectorAll("h1");
            if (h1Tags != null) {
                worksheet = taskUtil.processH1Tag(
                    h1Tags,
                    metaElements,
                    worksheet,
                    rowCounter);
            }

            // loop thru all meta tags
            const metaTags: NodeListOf<HTMLMetaElement> = virtualDocument.querySelectorAll("meta");
            for (let im = 0; im < metaTags.length; im++) {
                const nameAttribute: string | null = metaTags[im].getAttribute("name");
                const propertyAttribute: string | null = metaTags[im].getAttribute("property");
                const isNameMetatag: boolean = nameAttribute !== "" && nameAttribute != null;
                const isPropertyMetatag: boolean = propertyAttribute !== "" && propertyAttribute != null;

                // example: <meta name="description" content="Lorem ipsum">
                if (isNameMetatag) {
                    if (nameAttribute == null) {
                        continue;
                    }

                    // filters only those meta tags we're interested in
                    worksheet = taskUtil.processNameMetaTags(nameAttribute, metaElements, metaTags[im], worksheet, rowCounter);
                }

                // example: <meta property="og:type" content="website">
                if (isPropertyMetatag) {
                    if (propertyAttribute == null) {
                        continue;
                    }

                    // filters only those meta tags we're interested in
                    worksheet = taskUtil.processPropertyMetaTags(propertyAttribute, metaElements, metaTags[im], worksheet, rowCounter);
                }
            }

            rowCounter++;
        }

        worksheet = excelUtil.addExcelFooter(worksheet, ++rowCounter);
        wb.creator = "Clyde D'Souza";
        wb.lastModifiedBy = "Clyde D'Souza";
        wb.created = new Date();
        wb.xlsx.writeFile(`./${reportFilename}.xlsx`);
        console.log();
        console.log(reportFilename + ".xlsx created successfully.");
    } catch (err) {
        console.log();
        tl.setResult(tl.TaskResult.Failed, err.message);
    } finally {
        console.timeEnd("Execution time");
        console.log();
    }
}

// start here
run();


