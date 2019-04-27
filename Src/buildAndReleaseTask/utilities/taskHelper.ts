export class MetadataTagsIncluded {
    key:           string;
    displayText:    string;
    columnPosition: number;

    constructor(name: string, displayText: string, columnPosition:number) {
        this.key = name;
        this.columnPosition = columnPosition;
        this.displayText = displayText;
    } 
}

export class TaskHelper {  
    
    loadMetadataTagsIncluded() : Array<MetadataTagsIncluded> {
        var metadataElements = new Array<MetadataTagsIncluded>(); 
        // Essentials
        metadataElements.push(new MetadataTagsIncluded("title-tag", "Page title", 2));
        metadataElements.push(new MetadataTagsIncluded("description", "Page description", 3));
        metadataElements.push(new MetadataTagsIncluded("title", "Meta title", 4));

        // Open graph
        metadataElements.push(new MetadataTagsIncluded("og:type", "Open-graph type", 5));        
        metadataElements.push(new MetadataTagsIncluded("og:url", "Open-graph URL", 6));
        metadataElements.push(new MetadataTagsIncluded("og:title", "Open-graph title", 7));
        metadataElements.push(new MetadataTagsIncluded("og:description", "Open-graph description", 8));
        metadataElements.push(new MetadataTagsIncluded("og:site_name", "Site name", 9));

        // Twitter specific
        metadataElements.push(new MetadataTagsIncluded("twitter:card", "Twitter card type", 10));
        metadataElements.push(new MetadataTagsIncluded("twitter:site", "@username of website", 11));
        metadataElements.push(new MetadataTagsIncluded("twitter:image:alt", "Alternate Twitter image", 12));
        metadataElements.push(new MetadataTagsIncluded("twitter:creator", "@username of content creator", 13));

        // Others
        metadataElements.push(new MetadataTagsIncluded("fb:app_id", "Facebook app ID", 14));
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

    isSitemapURLValid(sitemapURL: string): boolean {
         var isValidURL = this._isURLValid(sitemapURL);
         return isValidURL ? sitemapURL.endsWith('.xml') : isValidURL;
    };

    isPageURLValid(pageURL: string): boolean {
        var isValidURL = this._isURLValid(pageURL);
        return isValidURL ? !pageURL.endsWith('.pdf') : isValidURL;
   };

    _isURLValid(userURL: string): boolean {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(userURL);
    };
}