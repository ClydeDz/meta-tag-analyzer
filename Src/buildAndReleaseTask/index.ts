import * as tl from 'azure-pipelines-task-lib/task';
import {Workbook, Row, Cell, Worksheet} from 'exceljs';
import * as WebRequest from 'web-request'; 
import * as domino from 'domino'; 

async function run() {
    console.time("Execution time");

    try {
        const sitemapURL: string = tl.getInput('sitemapURL', true);
        
        // TODO: Validate the URL using a helper method and use the below logic to throw an error
        // if (inputString == 'bad') {
        //     tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
        //     return;
        // }

        console.log('Sitemap file:', sitemapURL);

        // Makes a request to the sitemap file and creates a virtual document
        var sitemapXHRResult = await WebRequest.get(sitemapURL);  
        var virtualDocument = domino.createWindow(sitemapXHRResult.content).document;
        var allPagesInSitemap = virtualDocument.querySelectorAll('loc');
        console.log('Sitemap file LENGTH:', allPagesInSitemap.length);
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
            var currentURLXHRResult = await WebRequest.get(currentURL);  
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
                    if(nameAttribute == "title" || nameAttribute == "description"){
                        var nameAttributeContent = metaTags[im].getAttribute('content');
                        console.log("   ", nameAttribute, "=", nameAttributeContent);
                    } 
                }

                //Example: <meta property="og:type" content="website">
                if(isPropertyMetatag){
                    if(propertyAttribute == "og:type" || propertyAttribute == "og:url"){
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
    finally{
        console.timeEnd("Execution time");
    }
}

run();