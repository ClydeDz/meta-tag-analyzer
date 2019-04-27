import { Worksheet } from "exceljs";

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
        // Essentials
        metadataElements.push(new MetadataTagsIncluded("title-tag", "Page title", 2, 'tagElement'));
        metadataElements.push(new MetadataTagsIncluded("description", "Page description", 3, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("title", "Meta title", 4, 'nameAttr'));

        // Open graph
        metadataElements.push(new MetadataTagsIncluded("og:type", "Open-graph type", 5, 'propertyAttr'));        
        metadataElements.push(new MetadataTagsIncluded("og:url", "Open-graph URL", 6, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:title", "Open-graph title", 7, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:description", "Open-graph description", 8, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:site_name", "Site name", 9, 'propertyAttr'));

        // Twitter specific
        metadataElements.push(new MetadataTagsIncluded("twitter:card", "Twitter card type", 10, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("twitter:site", "@username of website", 11, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("twitter:image:alt", "Alternate Twitter image", 12, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("twitter:creator", "@username of content creator", 13, 'nameAttr'));

        // Others
        metadataElements.push(new MetadataTagsIncluded("fb:app_id", "Facebook app ID", 14, 'propertyAttr'));
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
        workingSheet.getRow(1).getCell(1).value = "URL";
        for (var si = 0; si < allMetaTags.length; si++){
            workingSheet.getRow(1).getCell(allMetaTags[si].columnPosition).value = allMetaTags[si].displayText;
        } 
        return workingSheet;
    }

    addExcelFooter(workingSheet: Worksheet, row: number): Worksheet {
        workingSheet.getRow(row).getCell(1).value = "Meta Data Analysis (c) 2019 Clyde D'Souza";
        workingSheet.getRow(row).getCell(2).value = "www.clydedsouza.net";
        return workingSheet;
    }

    addExcelCellContent(workingSheet: Worksheet, row: number, column: number, content: string): Worksheet{
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

    _isURLValid(userURL: string): boolean {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(userURL);
    };
}