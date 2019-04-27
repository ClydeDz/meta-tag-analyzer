import * as tl from 'azure-pipelines-task-lib/task';
import {Workbook, Row, Cell, Worksheet} from 'exceljs';
import * as WebRequest from 'web-request'; 
import * as domino from 'domino'; 

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

        // Makes a request to the sitemap file and creates a virtual document
        var sitemapXHRResult = await WebRequest.get(sitemapURL);  
        var virtualDocument = domino.createWindow(sitemapXHRResult.content).document;
        var allPagesInSitemap = virtualDocument.querySelectorAll('loc');
        const metaElements = taskHelper.loadMetadataTagsIncluded();

        // Create EXCEL file and add first static row
        var wb = new Workbook();
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
            var currentURLXHRResult = await WebRequest.get(currentURL);  
            var virtualDocument = domino.createWindow(currentURLXHRResult.content).document;

            // Title tag
            var titleTag = virtualDocument.querySelector('title');
            if(titleTag!=null){
                console.log("   ", "→", "Title", "=", titleTag.innerHTML);
                worksheet = taskHelper.addExcelCellContent(
                        worksheet, 
                        pageCounter,
                        taskHelper.getMetadataTagPosition('title-tag', metaElements),
                        titleTag.innerHTML
                    );
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
                    if(nameAttribute==null){
                        continue;
                    }

                    if(taskHelper.isKeyUnderNameAttrCategory(nameAttribute, metaElements)){
                        var nameAttributeContent = metaTags[im].getAttribute('content');

                        if(nameAttributeContent!=null){
                            console.log("   ", "→", nameAttribute, "=", nameAttributeContent);
                            worksheet = taskHelper.addExcelCellContent(
                                worksheet, 
                                pageCounter,
                                taskHelper.getMetadataTagPosition(nameAttribute, metaElements),
                                nameAttributeContent
                            );
                        }
                       
                    } 
                }

                // Example: <meta property="og:type" content="website">
                if(isPropertyMetatag){
                    if(propertyAttribute==null){
                        continue;
                    }

                    if(taskHelper.isKeyUnderPropertyAttrCategory(propertyAttribute, metaElements)){
                        var propertyAttributeContent = metaTags[im].getAttribute('content');
                        
                        if(propertyAttributeContent!=null){
                            console.log("   ", "→", propertyAttribute, "=", propertyAttributeContent);
                            worksheet = taskHelper.addExcelCellContent(
                                worksheet, 
                                pageCounter,
                                taskHelper.getMetadataTagPosition(propertyAttribute, metaElements),
                                propertyAttributeContent
                            );
                        }
                        
                    } 
                }
            } 

            pageCounter++;
        }

        worksheet = taskHelper.addExcelFooter(worksheet, ++pageCounter);
        wb.creator = "Clyde D'Souza";
        wb.lastModifiedBy  = "Clyde D'Souza";
        wb.created = new Date();
        wb.xlsx.writeFile('./'+reportFilename+'.xlsx');

    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
    finally{
        console.log();
        console.timeEnd("Execution time");
    }
}

run();