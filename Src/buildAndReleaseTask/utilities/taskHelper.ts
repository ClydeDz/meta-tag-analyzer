import {Workbook, Row, Cell, Worksheet} from 'exceljs';
import * as WebRequest from 'web-request'; 
import * as domino from 'domino'; 

import { ExcelHelper } from "./excelHelper";
import { MetadataTagsIncluded } from '../constants/appConstants';



export class TaskHelper {  
    excelHelper = new ExcelHelper();   

      

    getMetadataTagPosition(search: string, allMetaTags: MetadataTagsIncluded[]): number {
        for (var si = 0; si < allMetaTags.length; si++){
            if(search == allMetaTags[si].key){
                return allMetaTags[si].columnPosition;
            }
        }
        return 0;
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

    

    /**
     * Makes a request to the supplied URL and creates a virtual document 
     * @param url URL whose contents you want to fetch
     */
    async fetchURLAndLoadVirtualDocument(url: string): Promise<Document>{
        var currentURLXHRResult = await WebRequest.get(url);  
        return domino.createWindow(currentURLXHRResult.content).document;
    }
 

    isOutputFilenameValid(filename: string): boolean{ 
        if(filename == null || filename == "") return false;
        
        var invalidFilename = filename.indexOf('.xlsx') >= 0 || filename.indexOf('.xls') >= 0;
        return !invalidFilename; 
    }

    getTransformedInvalidOutputFilename(filename: string | null): string{ 
        if(filename == null || filename == "") return "<input was left blank>";

        return filename;
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

    _isURLValid(userURL: string): boolean {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(userURL);
    };

    //________________________Process tags_____________________________


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
        worksheet = this.excelHelper.addExcelCellContent(
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
        worksheet = this.excelHelper.addExcelCellContent(
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


    processTitleTag(titleTagContent: string, metaElements: MetadataTagsIncluded[], worksheet: Worksheet, rowCounter: number): Worksheet {
        console.log("   ", "→", "Title", "=", titleTagContent);  
        worksheet = this.excelHelper.addExcelCellContent(
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
        worksheet = this.excelHelper.addExcelCellContent(
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
        worksheet = this.excelHelper.addExcelCellContent(
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

}