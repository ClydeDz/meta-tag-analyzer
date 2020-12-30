export class MetadataTagsIncluded {
    key: string;
    displayText: string;
    columnPosition: number;
    category: string;

    constructor(name: string, displayText: string, columnPosition: number, category: string) {
        this.key = name;
        this.columnPosition = columnPosition;
        this.displayText = displayText;
        this.category = category;
    }

}

export class AppConstants {

    readonly reportWorksheetName: string = "Meta Data Analysis";
    readonly warningCellColor: string = "FFFF8C00";
    readonly alertCellColor: string = "FFFF6347";
    readonly highlightCellColor: string = "FFFFFF00";
    readonly copyrightText: string = "Meta Tag Analyzer (c) 2019 Clyde D'Souza";
    readonly startingRowNumber: number = 2;

    /**
     * Returns a list of metadata tags the is included in the report along with other details
     * useful for generating a report
     */
    getMetadataTagsIncluded(): Array<MetadataTagsIncluded> {
        const metadataElements = new Array<MetadataTagsIncluded>();
        let columnPosition = 1;

        // Essentials
        metadataElements.push(new MetadataTagsIncluded("title-tag", "Page title", ++columnPosition, "tagElement"));
        metadataElements.push(new MetadataTagsIncluded("title-tag-length", "Page title length", ++columnPosition, "tagElement"));
        metadataElements.push(new MetadataTagsIncluded("description", "Page description", ++columnPosition, "nameAttr"));
        metadataElements.push(new MetadataTagsIncluded("description-length", "Page description length", ++columnPosition, "nameAttr"));
        metadataElements.push(new MetadataTagsIncluded("title", "Meta title", ++columnPosition, "nameAttr"));
        metadataElements.push(new MetadataTagsIncluded("Keywords", "Keywords", ++columnPosition, "nameAttr"));

        // Open graph
        metadataElements.push(new MetadataTagsIncluded("og:image", "Open-graph image", ++columnPosition, "propertyAttr"));
        metadataElements.push(new MetadataTagsIncluded("og:url", "Open-graph URL", ++columnPosition, "propertyAttr"));
        metadataElements.push(new MetadataTagsIncluded("og:title", "Open-graph title", ++columnPosition, "propertyAttr"));
        metadataElements.push(new MetadataTagsIncluded("og:title-length", "Open-graph title length", ++columnPosition, "propertyAttr"));
        metadataElements.push(new MetadataTagsIncluded("og:description", "Open-graph description", ++columnPosition, "propertyAttr"));
        metadataElements.push(new MetadataTagsIncluded("og:description-length", "Open-graph description length", ++columnPosition, "propertyAttr"));
        metadataElements.push(new MetadataTagsIncluded("og:type", "Open-graph type", ++columnPosition, "propertyAttr"));
        metadataElements.push(new MetadataTagsIncluded("og:site_name", "Site name", ++columnPosition, "propertyAttr"));
        metadataElements.push(new MetadataTagsIncluded("og:locale", "Language", ++columnPosition, "propertyAttr"));

        // Twitter specific
        metadataElements.push(new MetadataTagsIncluded("twitter:card", "Twitter card type", ++columnPosition, "nameAttr"));
        metadataElements.push(new MetadataTagsIncluded("twitter:site", "@username of website", ++columnPosition, "nameAttr"));
        metadataElements.push(new MetadataTagsIncluded("twitter:image:alt", "Alternate Twitter image", ++columnPosition, "nameAttr"));
        metadataElements.push(new MetadataTagsIncluded("twitter:creator", "@username of content creator", ++columnPosition, "nameAttr"));

        // Others
        metadataElements.push(new MetadataTagsIncluded("fb:app_id", "Facebook app ID", ++columnPosition, "propertyAttr"));
        metadataElements.push(new MetadataTagsIncluded("ROBOTS", "Robots meta tag", ++columnPosition, "nameAttr"));
        metadataElements.push(new MetadataTagsIncluded("h1", "H1 element", ++columnPosition, "tagElement"));
        metadataElements.push(new MetadataTagsIncluded("h1-length", "H1 length", ++columnPosition, "tagElement"));
        metadataElements.push(new MetadataTagsIncluded("h1-number", "Number of H1 tags found", ++columnPosition, "tagElement"));

        return metadataElements;
    }
}

