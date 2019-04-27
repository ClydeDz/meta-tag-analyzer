import * as tl from 'azure-pipelines-task-lib/task';
import {Workbook, Row, Cell, Worksheet} from 'exceljs';

import { TaskHelper } from "./utilities/taskHelper";

async function run() {
    console.time("Execution time");
    const taskHelper = new TaskHelper();    

    try {
        // Task inputs
        const sitemapURL: string = tl.getInput('sitemapURL', true);
        const outputFilename: string = tl.getInput('outputFilename', false);
        var reportFilename = outputFilename;

        taskHelper.printConsoleCopyright();

        // Validate the URL
        if (!taskHelper.isSitemapURLValid(sitemapURL)) {
            tl.setResult(tl.TaskResult.Failed, 'Invalid sitemap URL detected');
            return;
        } 

        // Validate the file name
        if(!taskHelper.isOutputFilenameValid(outputFilename)){
            console.log(outputFilename, "was determined to be of an invalid file format. Default file name has been assigned to the output file.");
            reportFilename = "meta-tag-analyzer-report";
        }
 
        taskHelper.printSitemapFileURL(sitemapURL);
 
        var virtualDocument = await taskHelper.fetchURLAndLoadVirtualDocument(sitemapURL); 
        const metaElements = taskHelper.loadMetadataTagsIncluded();

        // Create EXCEL file and add first static row
        var wb = new Workbook();
        var worksheet = wb.addWorksheet('Meta Data Analysis');
        worksheet = taskHelper.addExcelHeader(worksheet, metaElements);
        
        // Row 1 is the header of the table, that's why we're starting from 2
        var rowCounter = 2;

        // A valid sitemap file needs to have the <loc> tag
        var allPagesInSitemap = virtualDocument.querySelectorAll('loc');

        // Loop thru all pages found in the sitemap file
        for (var i = 0; i < allPagesInSitemap.length; i++) {
            var currentURL = allPagesInSitemap[i].innerHTML; 

            // Check if we need to exclude URLs. Example: .pdf
            if (!taskHelper.isPageURLValid(currentURL)) {
                continue;
            }
             
            taskHelper.printPageURL(currentURL); 
            worksheet.getRow(rowCounter).getCell(1).value = currentURL;

            // Makes a request to the sitemap file and creates a virtual document
            var virtualDocument = await taskHelper.fetchURLAndLoadVirtualDocument(currentURL);

            // Title tag
            var titleTag = virtualDocument.querySelector('title');
            if (titleTag != null) {
                worksheet= taskHelper.processTitleTag(titleTag.innerHTML, metaElements, worksheet, rowCounter);               
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
                    worksheet = taskHelper.processNameMetaTags(nameAttribute, metaElements, metaTags[im], worksheet, rowCounter); 
                }

                // Example: <meta property="og:type" content="website">
                if(isPropertyMetatag){
                    if (propertyAttribute == null) {
                        continue;
                    }

                    // Filters only those meta tags we're interested in
                    worksheet = taskHelper.processPropertyMetaTags(propertyAttribute, metaElements, metaTags[im], worksheet, rowCounter); 
                }
            } 

            rowCounter++;
        }

        worksheet = taskHelper.addExcelFooter(worksheet, ++rowCounter);
        wb.creator = "Clyde D'Souza";
        wb.lastModifiedBy  = "Clyde D'Souza";
        wb.created = new Date();
        wb.xlsx.writeFile('./'+reportFilename+'.xlsx'); 
    }
    catch (err) {
        console.log();
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
    finally{
        console.log();
        console.timeEnd("Execution time");
    }
}

run();


