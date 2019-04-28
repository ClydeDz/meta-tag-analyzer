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
const WebRequest = __importStar(require("web-request"));
const domino = __importStar(require("domino"));
class MetadataTagsIncluded {
    constructor(name, displayText, columnPosition, category) {
        this.key = name;
        this.columnPosition = columnPosition;
        this.displayText = displayText;
        this.category = category;
    }
}
exports.MetadataTagsIncluded = MetadataTagsIncluded;
class TaskHelper {
    loadMetadataTagsIncluded() {
        var metadataElements = new Array();
        var columnPosition = 1;
        // Essentials
        metadataElements.push(new MetadataTagsIncluded("title-tag", "Page title", ++columnPosition, 'tagElement'));
        metadataElements.push(new MetadataTagsIncluded("title-tag-length", "Page title length", ++columnPosition, 'tagElement'));
        metadataElements.push(new MetadataTagsIncluded("description", "Page description", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("description-length", "Page description length", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("title", "Meta title", ++columnPosition, 'nameAttr'));
        // Open graph
        metadataElements.push(new MetadataTagsIncluded("og:type", "Open-graph type", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:url", "Open-graph URL", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:title", "Open-graph title", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:title-length", "Open-graph title length", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:description", "Open-graph description", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:description-length", "Open-graph description length", ++columnPosition, 'propertyAttr'));
        metadataElements.push(new MetadataTagsIncluded("og:site_name", "Site name", ++columnPosition, 'propertyAttr'));
        // Twitter specific
        metadataElements.push(new MetadataTagsIncluded("twitter:card", "Twitter card type", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("twitter:site", "@username of website", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("twitter:image:alt", "Alternate Twitter image", ++columnPosition, 'nameAttr'));
        metadataElements.push(new MetadataTagsIncluded("twitter:creator", "@username of content creator", ++columnPosition, 'nameAttr'));
        // Others
        metadataElements.push(new MetadataTagsIncluded("fb:app_id", "Facebook app ID", ++columnPosition, 'propertyAttr'));
        return metadataElements;
    }
    getMetadataTagPosition(search, allMetaTags) {
        for (var si = 0; si < allMetaTags.length; si++) {
            if (search == allMetaTags[si].key) {
                return allMetaTags[si].columnPosition;
            }
        }
        return 0;
    }
    addExcelHeader(workingSheet, allMetaTags) {
        let cellA1 = workingSheet.getRow(1).getCell(1);
        cellA1.value = "URL";
        cellA1.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' }
        };
        cellA1.font = {
            bold: true
        };
        for (var si = 0; si < allMetaTags.length; si++) {
            let cell = workingSheet.getRow(1).getCell(allMetaTags[si].columnPosition);
            cell.value = allMetaTags[si].displayText;
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' }
            };
            cell.font = {
                bold: true
            };
        }
        return workingSheet;
    }
    addExcelFooter(workingSheet, row) {
        // Legend
        workingSheet.getRow(++row).getCell(1).value = "Legend:";
        let legendCell1 = workingSheet.getRow(++row).getCell(1);
        legendCell1.value = "Over ideal limit";
        legendCell1.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF8C00' }
        };
        let legendCell2 = workingSheet.getRow(row).getCell(2);
        legendCell2.value = "No data when required";
        legendCell2.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF6347' }
        };
        ++row;
        // Meta
        workingSheet.getRow(++row).getCell(1).value = "Report geneted on:";
        workingSheet.getRow(row).getCell(2).value = new Date();
        workingSheet.getRow(++row).getCell(1).value = "Meta Tag Analyzer (c) 2019 Clyde D'Souza";
        workingSheet.getRow(row).getCell(2).value = "www.clydedsouza.net";
        return workingSheet;
    }
    addExcelCellContent(workingSheet, row, column, content) {
        workingSheet.getRow(row).getCell(column).value = content;
        return workingSheet;
    }
    isSitemapURLValid(sitemapURL) {
        var isValidURL = this._isURLValid(sitemapURL);
        return isValidURL ? sitemapURL.endsWith('.xml') : isValidURL;
    }
    ;
    isPageURLValid(pageURL) {
        var isValidURL = this._isURLValid(pageURL);
        return isValidURL ? !pageURL.endsWith('.pdf') : isValidURL;
    }
    ;
    isKeyUnderNameAttrCategory(key, allMetaTags) {
        for (var si = 0; si < allMetaTags.length; si++) {
            if (key == allMetaTags[si].key && allMetaTags[si].category == "nameAttr") {
                return true;
            }
        }
        return false;
    }
    ;
    isKeyUnderPropertyAttrCategory(key, allMetaTags) {
        for (var si = 0; si < allMetaTags.length; si++) {
            if (key == allMetaTags[si].key && allMetaTags[si].category == "propertyAttr") {
                return true;
            }
        }
        return false;
    }
    ;
    printPageURL(url) {
        console.log("");
        console.log("----------------------------------");
        console.log("URL:", url);
        console.log("----------------------------------");
    }
    /**
     * Makes a request to the supplied URL and creates a virtual document
     * @param url URL whose contents you want to fetch
     */
    fetchURLAndLoadVirtualDocument(url) {
        return __awaiter(this, void 0, void 0, function* () {
            var currentURLXHRResult = yield WebRequest.get(url);
            return domino.createWindow(currentURLXHRResult.content).document;
        });
    }
    printSitemapFileURL(url) {
        console.log("");
        console.log("==================================================");
        console.log('Sitemap file:', url);
        console.log("==================================================");
    }
    printConsoleCopyright() {
        console.log();
        console.log("****************************************");
        console.log("****************************************");
        console.log("Meta Tag Analyzer (c) 2019 Clyde D'Souza");
        console.log("****************************************");
        console.log("****************************************");
    }
    isOutputFilenameValid(filename) {
        if (filename == null || filename == "")
            return false;
        return !(filename.indexOf('.') >= 0);
    }
    processNameMetaTags(nameAttribute, metaElements, metaTag, worksheet, rowCounter) {
        if (!this.isKeyUnderNameAttrCategory(nameAttribute, metaElements)) {
            return worksheet;
        }
        var nameAttributeContent = metaTag.getAttribute('content');
        if (nameAttributeContent == null) {
            return worksheet;
        }
        console.log("   ", "→", nameAttribute, "=", nameAttributeContent);
        var position = this.getMetadataTagPosition(nameAttribute, metaElements);
        worksheet = this.addExcelCellContent(worksheet, rowCounter, position, nameAttributeContent);
        if (nameAttribute == "description") {
            worksheet = this.processTagLength(nameAttributeContent, metaElements, worksheet, rowCounter, 'description-length', this.getMaxLengthOfMetatag(nameAttribute), "Length of description");
        }
        return worksheet;
    }
    processPropertyMetaTags(propertyAttribute, metaElements, metaTag, worksheet, rowCounter) {
        if (!this.isKeyUnderPropertyAttrCategory(propertyAttribute, metaElements)) {
            return worksheet;
        }
        var propertyAttributeContent = metaTag.getAttribute('content');
        if (propertyAttributeContent == null) {
            return worksheet;
        }
        console.log("   ", "→", propertyAttribute, "=", propertyAttributeContent);
        var position = this.getMetadataTagPosition(propertyAttribute, metaElements);
        worksheet = this.addExcelCellContent(worksheet, rowCounter, position, propertyAttributeContent);
        if (propertyAttribute == "og:description" || propertyAttribute == "og:title") {
            worksheet = this.processTagLength(propertyAttributeContent, metaElements, worksheet, rowCounter, propertyAttribute + '-length', this.getMaxLengthOfMetatag(propertyAttribute), "Length of " + propertyAttribute);
        }
        return worksheet;
    }
    getMaxLengthOfMetatag(metatag) {
        if (metatag == "og:title" || metatag == "title-tag") {
            return 60;
        }
        if (metatag == "og:description" || metatag == "description") {
            return 300;
        }
        return 0;
    }
    processTitleTag(titleTagContent, metaElements, worksheet, rowCounter) {
        console.log("   ", "→", "Title", "=", titleTagContent); //titleTag.innerHTML
        worksheet = this.addExcelCellContent(worksheet, rowCounter, this.getMetadataTagPosition('title-tag', metaElements), titleTagContent);
        worksheet = this.processTagLength(titleTagContent, metaElements, worksheet, rowCounter, 'title-tag-length', this.getMaxLengthOfMetatag('title-tag'), "Length of title tag");
        return worksheet;
    }
    processTagLength(tagContent, metaElements, worksheet, rowCounter, key, maxLengthAllowed, consoleMessageForKey) {
        console.log("   ", "→", consoleMessageForKey, "=", tagContent.length); //titleTag.innerHTML
        let position = this.getMetadataTagPosition(key, metaElements);
        worksheet = this.addExcelCellContent(worksheet, rowCounter, position, tagContent.length);
        if (tagContent.length > maxLengthAllowed) {
            let tagLengthCell = worksheet.getRow(rowCounter).getCell(position);
            tagLengthCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF8C00' }
            };
        }
        if (tagContent.length == 0) {
            let tagLengthCell = worksheet.getRow(rowCounter).getCell(position);
            tagLengthCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF6347' }
            };
        }
        return worksheet;
    }
    _isURLValid(userURL) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(userURL);
    }
    ;
}
exports.TaskHelper = TaskHelper;
