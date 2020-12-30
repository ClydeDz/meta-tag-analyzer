import { Worksheet } from "exceljs";
import * as WebRequest from "web-request";
import * as domino from "domino";

import { ExcelUtil } from "./excelUtil";
import { MetadataTagsIncluded } from "../constants/appConstants";

export class TaskUtil {
    excelUtil = new ExcelUtil();

    /**
     * Get the column position of the supplied key from the list of metatags data
     * @param search Key to search
     * @param allMetaTags List of all metatags included in the report
     */
    getMetadataTagPosition(search: string, allMetaTags: MetadataTagsIncluded[]): number {
        for (let si = 0; si < allMetaTags.length; si++) {
            if (search == allMetaTags[si].key) {
                return allMetaTags[si].columnPosition;
            }
        }
        return 0;
    }

    /**
     * Validates if the sitemap URL supplied is of a valid format
     * @param sitemapURL The sitemap URL
     */
    isSitemapURLValid(sitemapURL: string | undefined): boolean {
        if (!sitemapURL || !this._isURLValid(sitemapURL)) {
            return false;
        }
        return sitemapURL.endsWith(".xml");
    }

    /**
     * Validates if the URL supplied is of a valid format
     * @param pageURL The URL of the publicly accessible page
     */
    isPageURLValid(pageURL: string): boolean {
        const isValidURL = this._isURLValid(pageURL);
        return isValidURL ? !pageURL.endsWith(".pdf") : isValidURL;
    }

    /**
     * Returns true if the key supplied is of the category 'nameAttr'
     * @param key Key to search
     * @param allMetaTags List of all metatags included in the report
     */
    isKeyUnderNameAttrCategory(key: string, allMetaTags: MetadataTagsIncluded[]): boolean {
        for (let si = 0; si < allMetaTags.length; si++) {
            if (key == allMetaTags[si].key && allMetaTags[si].category == "nameAttr") {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if the key supplied is of the category 'propertyAttr'
     * @param key Key to search
     * @param allMetaTags List of all metatags included in the report
     */
    isKeyUnderPropertyAttrCategory(key: string, allMetaTags: MetadataTagsIncluded[]): boolean {
        for (let si = 0; si < allMetaTags.length; si++) {
            if (key == allMetaTags[si].key && allMetaTags[si].category == "propertyAttr") {
                return true;
            }
        }
        return false;
    }

    /**
     * Makes a request to the supplied URL and creates a virtual document 
     * @param url URL whose contents you want to fetch
     */
    async fetchURLAndLoadVirtualDocument(url: string | undefined): Promise<Document> {
        if (!url) {
            return domino.createWindow("<p>Invalid URL</p>").document;
        }
        const currentURLXHRResult = await WebRequest.get(url);
        return domino.createWindow(currentURLXHRResult.content).document;
    }

    /**
     * Validates if the filename supplied is of a valid format
     * @param filename Filename supplied by the user
     */
    isOutputFilenameValid(filename: string | undefined): boolean {
        if (!filename) {
            return false;
        }

        const invalidFilename: boolean = filename.indexOf(".xlsx") >= 0 || filename.indexOf(".xls") >= 0;
        return !invalidFilename;
    }

    /**
     * Handles invalid or blank filename and returns a valid filename instead
     * @param filename Filename supplied by the user
     */
    getTransformedInvalidOutputFilename(filename: string | null | undefined): string {
        if (!filename) {
            return "<input was left blank or was not defined>";
        }

        return filename;
    }

    /**
     * Gets the max length of the supplied metatag
     * @param metatag Mettag key to check
     */
    getMaxLengthOfMetatag(metatag: string): number {
        if (metatag == "og:title" || metatag == "title-tag") {
            return 60;
        }
        if (metatag == "h1") {
            return 70;
        }
        if (metatag == "og:description" || metatag == "description") {
            return 300;
        }
        return 0;
    }

    /**
     * Validates the supplied URL
     * @param userURL URL of the page
     */
    _isURLValid(userURL: string): boolean {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(userURL);
    }


    //________________________Process tags_____________________________


    /**
     * Process meta tags with name attribute
     * @param nameAttribute The value of the name attribute
     * @param metaElements List of metatags included in the report
     * @param metaTag The metatag HTML element in context
     * @param worksheet The worksheet that this report is being written to
     * @param rowCounter Row number to write content  
     */
    processNameMetaTags(nameAttribute: string, metaElements: MetadataTagsIncluded[], metaTag: HTMLMetaElement, worksheet: Worksheet, rowCounter: number): Worksheet {
        if (!this.isKeyUnderNameAttrCategory(nameAttribute, metaElements)) {
            return worksheet;
        }

        const nameAttributeContent = metaTag.getAttribute("content");
        if (nameAttributeContent == null) {
            return worksheet;
        }

        console.log("   ", "→", nameAttribute, "=", nameAttributeContent);
        const position = this.getMetadataTagPosition(nameAttribute, metaElements);
        worksheet = this.excelUtil.addExcelCellContent(
            worksheet,
            rowCounter,
            position,
            nameAttributeContent);

        if (nameAttribute == "description") {
            worksheet = this.processTagLength(
                nameAttributeContent,
                metaElements,
                worksheet,
                rowCounter,
                "description-length",
                this.getMaxLengthOfMetatag(nameAttribute),
                "Length of description");
        }

        return worksheet;
    }

    /**
     * Process meta tags with property attribute
     * @param propertyAttribute The value of the property attribute
     * @param metaElements List of metatags included in the report
     * @param metaTag The metatag HTML element in context
     * @param worksheet The worksheet that this report is being written to
     * @param rowCounter Row number to write content 
     */
    processPropertyMetaTags(propertyAttribute: string, metaElements: MetadataTagsIncluded[], metaTag: HTMLMetaElement, worksheet: Worksheet, rowCounter: number): Worksheet {
        if (!this.isKeyUnderPropertyAttrCategory(propertyAttribute, metaElements)) {
            return worksheet;
        }

        const propertyAttributeContent = metaTag.getAttribute("content");
        if (propertyAttributeContent == null) {
            return worksheet;
        }

        console.log("   ", "→", propertyAttribute, "=", propertyAttributeContent);
        const position = this.getMetadataTagPosition(propertyAttribute, metaElements);
        worksheet = this.excelUtil.addExcelCellContent(
            worksheet,
            rowCounter,
            position,
            propertyAttributeContent
        );

        if (propertyAttribute == "og:description" || propertyAttribute == "og:title") {
            worksheet = this.processTagLength(
                propertyAttributeContent,
                metaElements,
                worksheet,
                rowCounter,
                propertyAttribute + "-length",
                this.getMaxLengthOfMetatag(propertyAttribute),
                "Length of " + propertyAttribute);
        }
        return worksheet;
    }


    /**
     * Process title tag
     * @param titleTagContent The value of the title tag
     * @param metaElements List of metatags included in the report
     * @param worksheet The worksheet that this report is being written to
     * @param rowCounter Row number to write content  
     */
    processTitleTag(titleTagContent: string, metaElements: MetadataTagsIncluded[], worksheet: Worksheet, rowCounter: number): Worksheet {
        console.log("   ", "→", "Title", "=", titleTagContent);
        worksheet = this.excelUtil.addExcelCellContent(
            worksheet,
            rowCounter,
            this.getMetadataTagPosition("title-tag", metaElements),
            titleTagContent
        );
        worksheet = this.processTagLength(
            titleTagContent,
            metaElements,
            worksheet,
            rowCounter,
            "title-tag-length",
            this.getMaxLengthOfMetatag("title-tag"),
            "Length of title tag");
        return worksheet;
    }


    /**
     * Process H1 tags
     * @param h1Tags The value of the H1 tag
     * @param metaElements List of metatags included in the report
     * @param worksheet The worksheet that this report is being written to
     * @param rowCounter Row number to write content  
     */
    processH1Tag(h1Tags: NodeListOf<HTMLHeadingElement>, metaElements: MetadataTagsIncluded[], worksheet: Worksheet, rowCounter: number): Worksheet {
        const firstH1TagContent = h1Tags[0].innerHTML;
        console.log("   ", "→", "H1", "=", firstH1TagContent);
        worksheet = this.excelUtil.addExcelCellContent(
            worksheet,
            rowCounter,
            this.getMetadataTagPosition("h1", metaElements),
            firstH1TagContent
        );

        worksheet = this.processTagLength(
            firstH1TagContent,
            metaElements,
            worksheet,
            rowCounter,
            "h1-length",
            this.getMaxLengthOfMetatag("h1"),
            "Length of H1 tag");

        worksheet = this.processTagLength(
            h1Tags,
            metaElements,
            worksheet,
            rowCounter,
            "h1-number",
            1,
            "Number of H1 tags");

        return worksheet;
    }

    /**
     * Process tag length of the meta tag. Handles how to report scenarios where length
     * is 0 or over the ideal limit
     * @param tagContent Content of the meta tag supplied
     * @param metaElements List of metatags included in the report
     * @param worksheet The worksheet that this report is being written to
     * @param rowCounter Row number to write content  
     * @param key Key of the meta tag in context
     * @param maxLengthAllowed Max length allowed for the key supplied
     * @param consoleMessageForKey Message to be displayed in log for this tag
     */
    processTagLength(tagContent: string | NodeListOf<HTMLHeadElement>,
        metaElements: MetadataTagsIncluded[], worksheet: Worksheet, rowCounter: number,
        key: string, maxLengthAllowed: number, consoleMessageForKey: string): Worksheet {

        console.log("   ", "→", consoleMessageForKey, "=", tagContent.length);
        const position = this.getMetadataTagPosition(key, metaElements);
        worksheet = this.excelUtil.addExcelCellContent(
            worksheet,
            rowCounter,
            position,
            tagContent.length
        );

        if (tagContent.length > maxLengthAllowed) {
            const tagLengthCell = worksheet.getRow(rowCounter).getCell(position);
            tagLengthCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF8C00" }
            };
        }

        if (tagContent.length == 0) {
            const tagLengthCell = worksheet.getRow(rowCounter).getCell(position);
            tagLengthCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF6347" }
            };
        }

        return worksheet;
    }

}