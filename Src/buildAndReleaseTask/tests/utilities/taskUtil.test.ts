import * as assert from 'assert';
import { TaskUtil } from "../../utilities/taskUtil";
import { AppConstants } from '../../constants/appConstants';

//_________________________________________________________________________________

describe('utilities / taskUtil / isSitemapURLValid', function () {
    it('should succeed with valid URLs', function(done: MochaDone) {
        this.timeout(1000);    
        const taskUtil = new TaskUtil();

        var isValidURL = taskUtil.isSitemapURLValid("https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/master/Sample/sitemap.xml");
        assert.equal(isValidURL, true, 'should have succeeded');
        isValidURL = taskUtil.isSitemapURLValid("https://profilesticker.net/sitemap.xml");
        assert.equal(isValidURL, true, 'should have succeeded');

        done();
    });    

    it('should fail with invalid URLs', function(done: MochaDone) {
        this.timeout(1000);    
        const taskUtil = new TaskUtil();

        var isValidURL = taskUtil.isSitemapURLValid("https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/");
        assert.equal(isValidURL, false, 'should have succeeded');
        isValidURL = taskUtil.isSitemapURLValid("https://profilesticker.net/sitemap.txt");
        assert.equal(isValidURL, false, 'should have succeeded');

        done();
    });  
});


//_________________________________________________________________________________

describe('utilities / taskUtil / isPageURLValid', function () {
    it('should succeed with valid URLs', function(done: MochaDone) {
        this.timeout(1000);    
        const taskUtil = new TaskUtil();

        var isValidURL = taskUtil.isPageURLValid("https://clydedz.github.io/sass-snippet-pack/");
        assert.equal(isValidURL, true, 'should have succeeded');
        isValidURL = taskUtil.isPageURLValid("https://profilesticker.net/about");
        assert.equal(isValidURL, true, 'should have succeeded');

        done();
    });    

    it('should fail with invalid URLs', function(done: MochaDone) {
        this.timeout(1000);    
        const taskUtil = new TaskUtil();

        var isValidURL = taskUtil.isPageURLValid("https://clydedz.github.io/sass-snippet-pack/content.pdf");
        assert.equal(isValidURL, false, 'should have succeeded');
        isValidURL = taskUtil.isPageURLValid("https://profilesticker.net/dummy.pdf");
        assert.equal(isValidURL, false, 'should have succeeded');

        done();
    });  
});


//_________________________________________________________________________________

describe('utilities / taskUtil / isOutputFilenameValid', function () {
    it('should succeed with valid filename', function(done: MochaDone) {
        this.timeout(1000);    
        const taskUtil = new TaskUtil();

        var isValidFilename = taskUtil.isOutputFilenameValid("meta-report");
        assert.equal(isValidFilename, true, 'should have succeeded');
        isValidFilename = taskUtil.isOutputFilenameValid("meta report post release pipeline");
        assert.equal(isValidFilename, true, 'should have succeeded');
        isValidFilename = taskUtil.isOutputFilenameValid("MetaTagReport-DemoBuild-20190429.2");
        assert.equal(isValidFilename, true, 'should have succeeded');
        done();
    });    

    it('should fail with invalid filename', function(done: MochaDone) {
        this.timeout(1000);    
        const taskUtil = new TaskUtil();

        var isValidFilename = taskUtil.isOutputFilenameValid("");
        assert.equal(isValidFilename, false, 'should have succeeded');
        isValidFilename = taskUtil.isOutputFilenameValid("report.xlsx");
        assert.equal(isValidFilename, false, 'should have succeeded');
        isValidFilename = taskUtil.isOutputFilenameValid("report.xlsx.latestreport");
        assert.equal(isValidFilename, false, 'should have succeeded');
        isValidFilename = taskUtil.isOutputFilenameValid("report.xls");
        assert.equal(isValidFilename, false, 'should have succeeded');
        isValidFilename = taskUtil.isOutputFilenameValid("report.xls.latestreport");
        assert.equal(isValidFilename, false, 'should have succeeded');
        done();
    });  
});

//_________________________________________________________________________________

describe('utilities / taskUtil / getTransformedInvalidOutputFilename', function () {
    it('should return transformed filename when filename is null or empty', function(done: MochaDone) {   
        const taskUtil = new TaskUtil();

        var transformedFilename = taskUtil.getTransformedInvalidOutputFilename("");
        assert.equal(transformedFilename, "<input was left blank>", 'should be <input was left blank>');
        transformedFilename = taskUtil.getTransformedInvalidOutputFilename(null);
        assert.equal(transformedFilename, "<input was left blank>", 'should be <input was left blank>');
        done();
    });  
    it('should return transformed filename when a valid filename is passed', function(done: MochaDone) {   
        const taskUtil = new TaskUtil();

        var transformedFilename = taskUtil.getTransformedInvalidOutputFilename("meta report");
        assert.equal(transformedFilename, "meta report", 'should be meta report');
        done();
    });    
});


//_________________________________________________________________________________

describe('utilities / taskUtil / getMetadataTagPosition', function () {
    it('should succeed with valid tags', function(done: MochaDone) {   
        const taskUtil = new TaskUtil();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var position = taskUtil.getMetadataTagPosition("title-tag", metatags);
        assert.equal(position, 2, 'should be 2'); 
        position = taskUtil.getMetadataTagPosition("description", metatags);
        assert.equal(position, 4, 'should be 4'); 
        done();
    });   
    it('should return 0 for invalid tags', function(done: MochaDone) {   
        const taskUtil = new TaskUtil();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var position = taskUtil.getMetadataTagPosition("script", metatags);
        assert.equal(position, 0, 'should be 0');
        position = taskUtil.getMetadataTagPosition("", metatags);
        assert.equal(position, 0, 'should be 0');
        done();
    });    
});

//_________________________________________________________________________________

describe('utilities / TaskUtil / isKeyUnderNameAttrCategory', function () {
    it('should true for name-attribute tags', function(done: MochaDone) {   
        const taskUtil = new TaskUtil();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var actual = taskUtil.isKeyUnderNameAttrCategory("title", metatags);
        assert.equal(actual, true, 'should be true'); 
        actual = taskUtil.isKeyUnderNameAttrCategory("twitter:creator", metatags);
        assert.equal(actual, true, 'should be true'); 
        done();
    });   
    it('should return false for non name-attribute tags', function(done: MochaDone) {   
        const taskUtil = new TaskUtil();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var actual = taskUtil.isKeyUnderNameAttrCategory("script", metatags);
        assert.equal(actual, false, 'should be 0');
        actual = taskUtil.isKeyUnderNameAttrCategory("", metatags);
        assert.equal(actual, false, 'should be 0');
        actual = taskUtil.isKeyUnderNameAttrCategory("og:title", metatags);
        assert.equal(actual, false, 'should be 0'); 
        done();
    });    
});


//_________________________________________________________________________________

describe('utilities / taskUtil / isKeyUnderPropertyAttrCategory', function () {
    it('should true for name-attribute tags', function(done: MochaDone) {   
        const taskUtil = new TaskUtil();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var actual = taskUtil.isKeyUnderPropertyAttrCategory("og:description", metatags);
        assert.equal(actual, true, 'should be true'); 
        actual = taskUtil.isKeyUnderPropertyAttrCategory("fb:app_id", metatags);
        assert.equal(actual, true, 'should be true'); 
        done();
    });   
    it('should return false for non name-attribute tags', function(done: MochaDone) {   
        const taskUtil = new TaskUtil();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var actual = taskUtil.isKeyUnderPropertyAttrCategory("Keywords", metatags);
        assert.equal(actual, false, 'should be 0');
        actual = taskUtil.isKeyUnderPropertyAttrCategory("", metatags);
        assert.equal(actual, false, 'should be 0');
        actual = taskUtil.isKeyUnderPropertyAttrCategory("twitter:site", metatags);
        assert.equal(actual, false, 'should be 0'); 
        done();
    });    
});


//_________________________________________________________________________________

describe('utilities / taskUtil / getMaxLengthOfMetatag', function () {
    it('should return correct length for meta tags', function(done: MochaDone) {   
        const taskUtil = new TaskUtil(); 

        var maxLength = taskUtil.getMaxLengthOfMetatag("h1");
        assert.equal(maxLength, 70, 'should be 70'); 
        maxLength = taskUtil.getMaxLengthOfMetatag("og:title");
        assert.equal(maxLength, 60, 'should be 60'); 
        maxLength = taskUtil.getMaxLengthOfMetatag("og:description");
        assert.equal(maxLength, 300, 'should be 300');
        done();
    });   
    it('should return 0 for meta tags not requiring a length check or invalid input', function(done: MochaDone) {   
        const taskUtil = new TaskUtil(); 

        var maxLength = taskUtil.getMaxLengthOfMetatag("");
        assert.equal(maxLength, 0, 'should be 0');
        maxLength = taskUtil.getMaxLengthOfMetatag("twitter:site");
        assert.equal(maxLength, 0, 'should be 0'); 
        maxLength = taskUtil.getMaxLengthOfMetatag("fb:app_id");
        assert.equal(maxLength, 0, 'should be 0'); 
        done();
    });    
});