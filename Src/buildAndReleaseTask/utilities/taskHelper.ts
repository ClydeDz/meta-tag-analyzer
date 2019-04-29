import {Workbook, Row, Cell, Worksheet} from 'exceljs';
import * as WebRequest from 'web-request'; 
import * as domino from 'domino'; 

export class MetadataTagsIncluded {
    key:            string;
    displayText:    string;
    columnPosition: number;
    category:       string;

    constructor(name: string, displayText: string, columnPosition:number, category: string) {
        this.key = name;
        this.columnPosition = columnPosition;
        this.displayText = displayText;
        this.category = category;
    } 
}

export class TaskHelper {  
    
    loadMetadataTagsIncluded() : Array<MetadataTagsIncluded> {
        var metadataElements = new Array<MetadataTagsIncluded>(); 
        var columnPosition = 1;

        // Essentials
        metadataElements.push(new MetadataTagsIncluded("title-tag", "Page title", ++columnPosition, 'tagElement'));
        metadataElements.push(new MetadataTagsIncluded("title-tag-length", "Page title length", ++columnPosition, 'tagElement'));
        metadataElements.push(new MetadataTagsIncluded("description", "Page description", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("description-length", "Page description length", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("title", "Meta title", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("Keywords", "Keywords", ++columnPosition, 'nameAttr'));

        // Open graph
        metadataElements.push(new MetadataTagsIncluded("og:image", "Open-graph image", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:url", "Open-graph URL", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:title", "Open-graph title", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:title-length", "Open-graph title length", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:description", "Open-graph description", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:description-length", "Open-graph description length", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:type", "Open-graph type", ++columnPosition, 'propertyAttr'));        
        metadataElements.push(new MetadataTagsIncluded("og:site_name", "Site name", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:locale", "Language", ++columnPosition, 'propertyAttr'));
        
        // Twitter specific
        metadataElements.push(new MetadataTagsIncluded("twitter:card", "Twitter card type", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("twitter:site", "@username of website", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("twitter:image:alt", "Alternate Twitter image", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("twitter:creator", "@username of content creator", ++columnPosition, 'nameAttr'));

        // Others
        metadataElements.push(new MetadataTagsIncluded("fb:app_id", "Facebook app ID", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("ROBOTS", "Robots meta tag", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("h1", "H1 element", ++columnPosition, 'tagElement'));
        metadataElements.push(new MetadataTagsIncluded("h1-length", "H1 length", ++columnPosition, 'tagElement'));
        metadataElements.push(new MetadataTagsIncluded("h1-number", "Number of H1 tags found", ++columnPosition, 'tagElement'));
        
        return metadataElements;
    }    

    getMetadataTagPosition(search: string, allMetaTags: MetadataTagsIncluded[]): number {
        for (var si = 0; si < allMetaTags.length; si++){
            if(search == allMetaTags[si].key){
                return allMetaTags[si].columnPosition;
            }
        }
        return 0;
    }

    addExcelHeader(workingSheet: Worksheet, allMetaTags: MetadataTagsIncluded[]): Worksheet {
        let cellA1 = workingSheet.getRow(1).getCell(1);
        cellA1.value = "URL";
        cellA1.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'FFFFFF00'} 
        };
        cellA1.font = {
            bold: true
        };

        for (var si = 0; si < allMetaTags.length; si++){
            let cell =  workingSheet.getRow(1).getCell(allMetaTags[si].columnPosition);
            cell.value = allMetaTags[si].displayText;
            cell.fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'FFFFFF00'}
            };
            cell.font = {
                bold: true
            };
        } 
        return workingSheet;
    }

    addExcelFooter(workingSheet: Worksheet, row: number): Worksheet {
        // Legend
        workingSheet.getRow(++row).getCell(1).value = "Legend:";
        let legendCell1 = workingSheet.getRow(++row).getCell(1);
        legendCell1.value = "Over ideal limit";
        legendCell1.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'FFFF8C00'}
        };
        let legendCell2 = workingSheet.getRow(row).getCell(2);
        legendCell2.value = "No data when required";
        legendCell2.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'FFFF6347'}
        }; 
        workingSheet.getRow(++row).getCell(1).value = "Blank cells mean the tag wasn't found on a page";
        ++row;

        // Meta
        workingSheet.getRow(++row).getCell(1).value = "Report generated on: ";
        workingSheet.getRow(row).getCell(2).value = "" + new Date();
        workingSheet.getRow(++row).getCell(1).value = "Meta Tag Analyzer (c) 2019 Clyde D'Souza";
        workingSheet.getRow(row).getCell(2).value = "www.clydedsouza.net";
        return workingSheet;
    }

    addExcelCellContent(workingSheet: Worksheet, row: number, column: number, content: any): Worksheet{
        workingSheet.getRow(row).getCell(column).value = content;
        return workingSheet;
    }

    isSitemapURLValid(sitemapURL: string): boolean {
         var isValidURL = this._isURLValid(sitemapURL);
         return isValidURL ? sitemapURL.endsWith('.xml') : isValidURL;
    };

    isPageURLValid(pageURL: string): boolean {
        var isValidURL = this._isURLValid(pageURL);
        return isValidURL ? !pageURL.endsWith('.pdf') : isValidURL;
   };

    isKeyUnderNameAttrCategory(key: string, allMetaTags: MetadataTagsIncluded[]): boolean { 
        for (var si = 0; si < allMetaTags.length; si++){
            if(key == allMetaTags[si].key && allMetaTags[si].category=="nameAttr"){
                return true;
            }
        } 
        return false;
    };

    isKeyUnderPropertyAttrCategory(key: string, allMetaTags: MetadataTagsIncluded[]): boolean {
        for (var si = 0; si < allMetaTags.length; si++){
            if(key == allMetaTags[si].key && allMetaTags[si].category=="propertyAttr"){
                return true;
            }
        } 
        return false;
    };

    printPageURL(url: string){
        console.log("");
        console.log("----------------------------------");
        console.log("URL:", url);
        console.log("----------------------------------");
    }

    /**
     * Makes a request to the supplied URL and creates a virtual document 
     * @param url URL whose contents you want to fetch
     */
    async fetchURLAndLoadVirtualDocument(url: string): Promise<Document>{
        var currentURLXHRResult = await WebRequest.get(url);  
        return domino.createWindow(currentURLXHRResult.content).document;
    }

    printSitemapFileURL(url: string){
        console.log("");
        console.log("==================================================");
        console.log('Sitemap file:', url);
        console.log("==================================================");
    }

    printConsoleCopyright(){
        console.log();
        console.log("****************************************");
        console.log("****************************************");
        console.log("Meta Tag Analyzer (c) 2019 Clyde D'Souza");
        console.log("****************************************");
        console.log("****************************************");
    }

    isOutputFilenameValid(filename: string): boolean{ 
        if(filename == null || filename == "") return false;
        
        var invalidFilename = filename.indexOf('.xlsx') >= 0 || filename.indexOf('.xls') >= 0;
        return !invalidFilename; 
    }

    processNameMetaTags(nameAttribute: string, metaElements: MetadataTagsIncluded[], metaTag: HTMLMetaElement, worksheet: Worksheet, rowCounter: number): Worksheet {
        if (!this.isKeyUnderNameAttrCategory(nameAttribute, metaElements)) {
            return worksheet;
        }
        
        var nameAttributeContent = metaTag.getAttribute('content');
        if (nameAttributeContent == null) {
            return worksheet;            
        }

        console.log("   ", "→", nameAttribute, "=", nameAttributeContent);
        var position = this.getMetadataTagPosition(nameAttribute, metaElements);
        worksheet = this.addExcelCellContent(
            worksheet, 
            rowCounter, 
            position, 
            nameAttributeContent);

        if(nameAttribute == "description"){
            worksheet = this.processTagLength(
                nameAttributeContent,
                metaElements,
                worksheet,
                rowCounter,
                'description-length',
                this.getMaxLengthOfMetatag(nameAttribute),
                "Length of description");
        }

        return worksheet;
    }

    processPropertyMetaTags(propertyAttribute: string, metaElements: MetadataTagsIncluded[], metaTag: HTMLMetaElement, worksheet: Worksheet, rowCounter: number): Worksheet {
        if (!this.isKeyUnderPropertyAttrCategory(propertyAttribute, metaElements)) {
            return worksheet;
        }

        var propertyAttributeContent = metaTag.getAttribute('content');
        if (propertyAttributeContent == null) {
            return worksheet;
        }

        console.log("   ", "→", propertyAttribute, "=", propertyAttributeContent);
        var position = this.getMetadataTagPosition(propertyAttribute, metaElements);
        worksheet = this.addExcelCellContent(
            worksheet,
            rowCounter,
            position,
            propertyAttributeContent
        ); 

        if(propertyAttribute == "og:description" || propertyAttribute == "og:title"){
            worksheet = this.processTagLength(
                propertyAttributeContent,
                metaElements,
                worksheet,
                rowCounter,
                propertyAttribute+'-length',
                this.getMaxLengthOfMetatag(propertyAttribute),
                "Length of "+propertyAttribute);
        }  
        return worksheet;
    }

    getMaxLengthOfMetatag(metatag: string): number{
        if(metatag == "og:title" || metatag == "title-tag"){
            return 60;
        }
        if(metatag == "h1"){
            return 70;
        }
        if(metatag == "og:description" || metatag == "description"){
            return 300;
        }
        return 0;
    }

    processTitleTag(titleTagContent: string, metaElements: MetadataTagsIncluded[], worksheet: Worksheet, rowCounter: number): Worksheet {
        console.log("   ", "→", "Title", "=", titleTagContent);  
        worksheet = this.addExcelCellContent(
            worksheet,
            rowCounter,
            this.getMetadataTagPosition('title-tag', metaElements),
            titleTagContent
        ); 
        worksheet = this.processTagLength(
            titleTagContent,
            metaElements,
            worksheet,
            rowCounter,
            'title-tag-length',
            this.getMaxLengthOfMetatag('title-tag'),
            "Length of title tag");
        return worksheet;
    }

    processH1Tag(h1Tags: NodeListOf<HTMLHeadingElement>, metaElements: MetadataTagsIncluded[], worksheet: Worksheet, rowCounter: number): Worksheet {  
        var firstH1TagContent = h1Tags[0].innerHTML;
        console.log("   ", "→", "H1", "=", firstH1TagContent); 
        worksheet = this.addExcelCellContent(
            worksheet,
            rowCounter,
            this.getMetadataTagPosition('h1', metaElements),
            firstH1TagContent
        ); 

        worksheet = this.processTagLength(
            firstH1TagContent,
            metaElements,
            worksheet,
            rowCounter,
            'h1-length',
            this.getMaxLengthOfMetatag('h1'),
            "Length of H1 tag");

        worksheet = this.processTagLength(
                h1Tags,
                metaElements,
                worksheet,
                rowCounter,
                'h1-number',
                1,
                "Number of H1 tags"); 

        return worksheet;
    }

    processTagLength(tagContent: any, metaElements: MetadataTagsIncluded[], worksheet: Worksheet, rowCounter: number,
        key: string, maxLengthAllowed: number, consoleMessageForKey: string): Worksheet {

        console.log("   ", "→", consoleMessageForKey, "=", tagContent.length); 
        let position = this.getMetadataTagPosition(key, metaElements);
        worksheet = this.addExcelCellContent(
            worksheet,
            rowCounter,
            position,
            tagContent.length
        );        

        if(tagContent.length > maxLengthAllowed){
            let tagLengthCell = worksheet.getRow(rowCounter).getCell(position);
            tagLengthCell.fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'FFFF8C00'}
            }; 
        }

        if(tagContent.length == 0){
            let tagLengthCell = worksheet.getRow(rowCounter).getCell(position);
            tagLengthCell.fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'FFFF6347'}
            }; 
        }

        return worksheet;
    }



    _isURLValid(userURL: string): boolean {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(userURL);
    };
}